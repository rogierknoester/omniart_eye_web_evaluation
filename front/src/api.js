import axios from "axios";

const base = 'http://' + window.location.hostname + ':5000';


export async function get_fake_eyes(count=8) {
    const response =  await axios.get(`${base}/generate_eyes/${count}`);
    return response.data
}

export async function get_real_eyes() {
    const response =  await axios.get(base + '/load_real_eyes');
    return response.data
}

export async function get_evaluation_sample() {
    const response = await axios.get(base + '/evaluation_sample');
    return response.data
}

export async function post_results(results) {
    return await axios.post(base + '/add_result', {results})
}