import {Button, Column, Columns, Heading} from "bloomer";
import React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {get_evaluation_sample} from "./api";


class Home extends React.Component {
    isLoading = observable({isStartLoading: false});



    onStartClick = async () => {
        this.isLoading.isStartLoading = true;

        const sample = {first: await get_evaluation_sample(), second: await get_evaluation_sample()};

        this.isLoading.isStartLoading = false;

        this.props.onStartFinished(sample)
    };

    render() {
        return <Columns>
            <Column isSize={6}>
                <p>
                    Hi! One of the parts in my thesis is about creating a "painted eye" generator. This
                    generator is able to paint eyes, from nothing. It is trained on a dataset of eyes that are
                    extracted from the <a
                    href={"http://isis-data.science.uva.nl/strezoski/#2"}>OmniArt</a> dataset.

                    <br/>
                    The best way to evaluate this generator is to see if humans can spot the fake eyes.<br/>
                    So, in this small experiment you, the art connoisseur, are tasked with finding "fake painted
                    eyes".
                </p>
            </Column>
            <Column isSize={6} hasTextAlign={'centered'}>
                <Button isSize='large' isColor={'primary'} onClick={this.onStartClick}
                        isLoading={this.isLoading.isStartLoading}>
                    Start
                </Button>
                {this.isLoading.isStartLoading && <Heading>Painting eyes...</Heading>}
            </Column>
        </Columns>;
    }
}


export default observer(Home)