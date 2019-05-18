import {observer} from "mobx-react";

import {Button, Column, Columns, Subtitle} from "bloomer";
import React from "react";
import {observable} from "mobx";

class Task extends React.Component {

    phase = observable.box('first');

    onEyeClick = eye => {
        eye.deemed_fake = !eye.deemed_fake;
    };

    next = () => {
        if (this.phase.get() === 'first') {
            this.phase.set('second');
        } else {
            this.props.onFinish();
        }
    };

    render() {
        const eyes = this.props.sample[this.phase.get()];

        return <Columns>


            <Column isSize={12} hasTextAlign={'centered'}>

                {this.phase.get() === 'first' &&
                <Subtitle>Select the eyes that you think are <strong>fake</strong>.</Subtitle>
                }
                {this.phase.get() === 'second' &&
                <Subtitle>Again, select the eyes that you think are <strong>fake</strong>. After this you are
                    done.</Subtitle>
                }

                <Columns isMultiline>
                    {eyes.map((eye, index) => {

                        const style = {cursor: 'pointer'};
                        if (eye.deemed_fake === true) {
                            style.opacity = 0.3;
                        }

                        return <Column key={index} isSize={3}>
                            <img style={style} onClick={() => this.onEyeClick(eye)} key={index}
                                 src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>
                        </Column>
                    })}
                </Columns>

                <Button isSize='large' isColor={'primary'} onClick={this.next}>
                    {this.phase.get() === 'first' && 'Next'}
                    {this.phase.get() === 'second' && 'Finish'}
                </Button>


            </Column>
        </Columns>
    }
}


export default observer(Task)