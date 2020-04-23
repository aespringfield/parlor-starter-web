import React, { Component } from 'react';
import { GameContext } from '../pages/Parlor';
import { UserContext } from '../pages/Parlor'

export default class HostControls extends Component {
    constructor(props) {
        super(props);

        this.handleSwitchPlayer = this.handleSwitchPlayer.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);
    }

    handleSwitchPlayer() {

    }

    handleGameStart(userUpdater, gameUpdater) {
        return () => {
            gameUpdater({
                name: null,
                code: null,
                id: null,
                config: {}
            })
            userUpdater({
                role: 'HOST'
            })
        }
    }

    handleGameJoin(userUpdater, gameUpdater) {
        return () => {
            gameUpdater({
                name: null,
                code: null,
                id: null,
                config: {}
            })
            userUpdater({
                role: 'GUEST'
            })
        }
    }

    render() {
        return (
            <div>
                <UserContext.Consumer>
                    {
                        ({ user, updater: userUpdater }) => (
                            <GameContext.Consumer>
                                {
                                    ({ game, updater: gameUpdater }) => (
                                        <div>
                                            <button onClick={ this.handleGameStart(userUpdater, gameUpdater) }>New game</button>
                                            <button onClick={ this.handleGameJoin(userUpdater, gameUpdater) }>Join game</button>
                                            {
                                                console.log('USER:', user, 'GAME', game)
                                            }
                                        </div>
                                    )
                                }
                            </GameContext.Consumer>
                        )
                    }

                </UserContext.Consumer>
                
                {/* <button onClick={ this.handleSwitchPlayer }>Switch to new player</button> */}
            </div>
        )
    }
}