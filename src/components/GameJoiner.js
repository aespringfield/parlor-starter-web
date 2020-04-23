import React, { Component } from 'react'
import { GameContext } from '../pages/Parlor'
import { db } from '../services/firebase';

export default class GameJoiner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameCode: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    // Make less promise-y
    handleSubmit(updater) {
        return(event) => {
            event.preventDefault();

            return new Promise((resolve) => {
                db.ref('games')
                .orderByChild('code')
                .equalTo(this.state.gameCode)
                .once('value', snapshot => {
                    resolve(snapshot)
                })
            }).then(async (snapshot) => {
                // Find a nicer way to do this
                const gameId = Object.keys(snapshot.val())[0]

                updater({
                    id: gameId,
                    code: this.state.gameCode,
                    name: snapshot.val()[gameId].name,
                    config: {
                        deckId: snapshot.val()[gameId].deck
                    }
                })
            })
        }
        
    }

    // }
    render() {
        return(
            <div>
                <GameContext.Consumer>
                    {
                        ({ game, updater }) => (
                            <div>
                            <form onSubmit={ this.handleSubmit(updater) }>
                                <input
                                    name="gameCode"
                                    value={this.state.gameCode}
                                    id="game-code"
                                    onChange={ this.handleChange }
                                />
                                <label htmlFor="game-code">
                                    Enter the code for the game you'd like to join
                                </label>
                                <button type="submit">Join game</button>
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