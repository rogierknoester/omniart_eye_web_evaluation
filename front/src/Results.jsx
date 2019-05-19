import React from "react"
import {observer} from "mobx-react";
import {Column, Columns, Icon, Subtitle} from "bloomer";
import {post_results} from "./api";

class Results extends React.Component {


    render() {

        const eyes = [...this.props.eyes.first, ...this.props.eyes.second];

        post_results(eyes.filter(eye => eye.hasOwnProperty('noise')).map(eye => ({
            noise: eye.noise,
            deemed_fake: eye.deemed_fake
        })));

        const deemed_fake = eyes.filter(eye => eye.deemed_fake);
        const correctly_deemed = eye => eye.hasOwnProperty('noise') ? eye.deemed_fake : !eye.deemed_fake;


        return <Columns>
            <Column>

                <p>Thanks for participating in this small experiment! Below you can see which of the eyes you marked as
                    fake are really fake, and which eyes you missed.</p>

                <br/>

                <Subtitle>You marked these eyes as fake</Subtitle>
                <Columns isMultiline>

                    {deemed_fake.map((eye, index) => {
                        return <Column isSize={2} hasTextAlign={'centered'}>
                            <img key={index} src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>
                            <br/>
                            {correctly_deemed(eye) ?
                                <Icon isSize="medium" className="fa fa-check fa-2x" style={{color: '#96ff8a'}}/> :
                                <Icon isSize="medium" className="fa fa-times fa-2x" style={{color: '#ff7e7b'}}/>}
                        </Column>
                    })}
                </Columns>

                <Subtitle>But you missed these fake eyes</Subtitle>

                <Columns isMultiline>
                    {eyes.filter(eye => eye.hasOwnProperty('noise') && !eye.deemed_fake).map((eye, index) => {
                        return <Column isSize={2} hasTextAlign={'centered'}>
                            <img key={index} src={'data:image/jpeg;base64, ' + eye.image} alt={''}/>
                        </Column>
                    })}
                </Columns>


            </Column>


        </Columns>
    }
}


export default observer(Results);