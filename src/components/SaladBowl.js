import React, { Component } from 'react';
import CardReader from './CardReader';
import CardWriter from './CardWriter';
import { auth, db } from '../services/firebase';

export default class SaladBowl extends Component {
    componentWillUnmount() {
        this.props.updater({
            config: {
                deckId: null
            }
        })
    }

    render() {
        return (
            <div>
                { console.log('deckid', this.props.config.deckId) }
                <CardWriter deckId={this.props.config.deckId}/>
                <CardReader deckId={this.props.config.deckId}/>
            </div>
        )
    }
}