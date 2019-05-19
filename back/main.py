import sqlite3
from io import StringIO, BytesIO
from base64 import b64encode
import json
import torch
from PIL import Image
from flask import Flask, send_file, jsonify, request
from flask_cors import CORS
from omniart_eye_dataset import OmniArtEyeDataset, OA_DATASET_COLOR_25x25
from omniart_eye_generator import generate_eye, classes, generate_noise, eye_generator
import random
import torchvision.transforms as transforms

app = Flask(__name__)
CORS(app)


def get_encoded_fake_eyes(count):
    eyes = []
    for idx in range(count):
        class_name = random.choice(classes)
        noise = generate_noise()
        eye = generate_eye(class_name, noise=noise)

        buffered = BytesIO()
        eye.save(buffered, format="JPEG")
        b64_image = b64encode(buffered.getvalue()).decode('utf-8')

        noise_array = noise.cpu().numpy().tolist()

        eyes.append({'image': b64_image, 'noise': noise_array, 'class_name': class_name, 'deemed_fake': False})
    return eyes


def get_encoded_real_eyes(count):
    total_eyes = []
    while len(total_eyes) < count:
        eye_tensors, colors, metadata = next(iter(loader))
        eye_images = eye_generator.__to_image(eye_tensors)
        eyes = []
        for eye in eye_images:
            buffered = BytesIO()
            eye.save(buffered, format="JPEG")
            b64_image = b64encode(buffered.getvalue()).decode('utf-8')
            eyes.append({'image': b64_image, 'deemed_fake': False})
        total_eyes = total_eyes + eyes
    return total_eyes[:count]


@app.route("/generate_eyes")
@app.route("/generate_eyes/<int:count>")
def generate_eyes(count=8):
    eyes = get_encoded_fake_eyes(count)

    return jsonify(eyes)


omniart_eyes = OmniArtEyeDataset(
    transform=transforms.Compose([transforms.Resize((128, 128), interpolation=Image.LANCZOS), transforms.ToTensor(),
                                  transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))]),
    dataset_type=OA_DATASET_COLOR_25x25)
loader = torch.utils.data.DataLoader(omniart_eyes, batch_size=8, shuffle=True, num_workers=1)


@app.route("/load_real_eyes")
def load_real_eyes():
    eyes = get_encoded_real_eyes(8)

    return jsonify(eyes)


@app.route("/evaluation_sample")
def sample_for_eval():
    fake_eyes = get_encoded_fake_eyes(8)
    real_eyes = get_encoded_real_eyes(8)

    eyes = fake_eyes + real_eyes
    random.shuffle(eyes)
    return jsonify(eyes)


@app.route("/add_result", methods=["POST"])
def add_result():
    db = sqlite3.connect('./results.db');
    cursor = db.cursor()

    cursor.execute('''create table if not exists results
(
    id          integer
        constraint results_pk
            primary key autoincrement,
    noise       text,
    deemed_fake integer
);

''')
    db.commit()

    results = request.get_json()['results']

    data = [((json.dumps(eye['noise']), int(eye['deemed_fake']))) for eye in results]
    cursor.executemany('''INSERT INTO results (noise, deemed_fake) VALUES (?, ?)''', data)
    db.commit()
    return ('', 204)


if __name__ == '__main__':
    app.run()
