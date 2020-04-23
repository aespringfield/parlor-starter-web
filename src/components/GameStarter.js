import React, { Component } from 'react'
import { GameContext } from '../pages/Parlor'
import { auth, db } from '../services/firebase';
import { generateCode } from '../helpers/codes'

export default class GameStarter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(updater) {
        return async (event) => {
            event.preventDefault();

            const gameCode = generateCode()
            const gameKey = (await db.ref('games').push()).key

            // Fix this to make not game specific
            // (tried to do in SaladBowl component
            // on componentDidMount, but didn't
            // happed soon enough for the child
            // components to have a deckId)
            const config = await this.buildSaladBowlConfig();

            await db.ref(`games/${gameKey}`).set({
                name: this.state.gameName,
                code: gameCode,
                // Do this more extendably
                deck: config.deckId
            });

            updater({
                name: this.state.gameName,
                code: gameCode,
                id: gameKey,
                config: config
            })
        }
        
    }

    async buildSaladBowlConfig() {
        const deckId = (await db.ref('decks').push()).key
        return {
            deckId: deckId
        }
    }

    // handleGameStart = (event) => {

    // }
    render() {
        return(
            <div>
                <GameContext.Consumer>
                    {
                        ({ game, updater }) => (
                            <div>
                            <p>What game would you like to play?</p>
                            <form onSubmit={ this.handleSubmit(updater) }>
                                <input
                                    type="radio"
                                    name="gameName"
                                    value="Salad Bowl"
                                    id="salad-bowl"
                                    onChange={ this.handleChange }
                                />
                                <label htmlFor="salad-bowl">
                                    Salad Bowl
                                </label>
                                <button type="submit">Start game</button>
                                {console.log(game)}
                                {
                                    game.name
                                     ? <p>Looks like you're gonna play {game.name}</p>
                                     : null
                                }
                            </form>
                            </div>
                        )
                    }
                </GameContext.Consumer>

                {/* // <button onClick={handleGameStart}>New game</button> */}
            </div>
        );
    }

}