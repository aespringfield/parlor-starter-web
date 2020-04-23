import React, { Component } from 'react';
import { db } from '../services/firebase';

export default class CardWriter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardText: '',
            writeError: null
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            cardText: event.target.value
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({
            writeError: null
        })
        try {
            const newCardKey = (await db.ref('cards').push()).key;
            const updates = {
                [`/cards/${newCardKey}/text`]: this.state.cardText,
                [`/decks/${this.props.deckId}/cards/${newCardKey}`]: {
                    drawable: true
                }
            }

            await db.ref().update(updates);
            this.setState({
                cardText: ''
            })
        } catch(error) {
            this.setState({
                writeError: error.message
            })
        }
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} value={this.state.cardText}></input>
                        { this.state.error ? <p>{this.state.writeError}</p> : null }
                    <button type="submit">Send</button>
                </form>
            </div>
        )
    }
}