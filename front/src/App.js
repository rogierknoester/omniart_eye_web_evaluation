import React from 'react';
import "bulma";
import {Column, Columns, Container, Title} from "bloomer";
import {observable} from "mobx";
import {get_fake_eyes} from "./api";
import {observer} from "mobx-react";
import Home from "./Home";
import Task from "./Task";
import Results from "./Results";


class App extends React.Component {

    routing = observable({
        current: 'home'
    });

    fake_eyes = observable([]);
    real_eyes = observable([]);

    evaluation_eyes = observable({'first': [], 'second': []});

    async componentWillMount() {
        const fake_eyes = await get_fake_eyes(20);
        this.fake_eyes.push(...fake_eyes);
    }

    onStart = async (eyes) => {
        this.evaluation_eyes.first = eyes.first;
        this.evaluation_eyes.second = eyes.second;
        this.routing.current = 'task'
    };

    onFinishEvaluation = () => {
        this.routing.current = 'results';
    };

    render() {
        return <Container style={{marginTop: '50px'}}><Columns isCentered>
            <Column isSize={12}>
                <Title>Master's Thesis - Eye colour through time</Title>

                {this.routing.current === 'home' && <Home onStartFinished={this.onStart}/>}
                {this.routing.current === 'home' && this.fake_eyes.map((eye, index) => {
                    return <img key={index} src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>
                })}
                {this.routing.current === 'task' && <Task onFinish={this.onFinishEvaluation} sample={this.evaluation_eyes} phase={'first'}/>}
                {this.routing.current === 'results' && <Results eyes={this.evaluation_eyes} />}

                {this.real_eyes.map((eye, index) => {
                    return <img key={index} src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>
                })}
            </Column>

        </Columns></Container>;
    }
}

export default observer(App);
