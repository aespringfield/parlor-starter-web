import React, { Component } from 'react';
import { auth, db } from '../services/firebase';
import CardWriter from '../components/CardWriter';
import CardReader from '../components/CardReader';
import GameStarter from '../components/GameStarter';
import GameJoiner from '../components/GameJoiner';
import HostControls from '../components/HostControls';
import SaladBowl from '../components/SaladBowl';

export const GameContext = React.createContext()
export const UserContext = React.createContext()

export default class Parlor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                name: null,
                code: null,
                id: null,
                config: {}
            },
            user: {
                role: null
            }
        }
        
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }

    updateGameInfo(opts) {
        console.log('game opts', opts)
        this.setState({
            game: { ...this.state.game, ...opts }
        })
    }

    updateUserInfo(opts) {
        console.log('opts', opts)
        this.setState({
            user: { ...this.state.user, ...opts }
        })
    }

    render() {
        return(
            <div>
                <UserContext.Provider
                    value={{
                        user: this.state.user,
                        updater: this.updateUserInfo
                    }}
                >
                    <GameContext.Provider
                        value={{
                            game: this.state.game,
                            updater:this.updateGameInfo
                        }}
                    >
                        <HostControls />
                        {
                            !this.state.game.name && this.state.user.role === 'HOST'
                                ? <GameStarter />
                                : null
                        }
                        {
                            !this.state.game.name && this.state.user.role === 'GUEST'
                                ? <GameJoiner />
                                : null
                        }
                        {
                            this.state.game.name === 'Salad Bowl'
                                ? <SaladBowl
                                    config={this.state.game.config}
                                    updater={this.updateGameInfo}
                                />
                                : null
                        }
                    </GameContext.Provider>
                </UserContext.Provider>
            </div>
        )
    }
}

