import React, { Component } from 'react';
import { db } from '../services/firebase'
import { drawRandomCard } from '../helpers/cards'
import { UserContext } from '../pages/Parlor';

export default class CardReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            currentCard: null,
            // Move this somewhere that makes more sense
            cardsGotten: 0,
            error: null
        }

        this.getCardsForDeck = this.getCardsForDeck.bind(this);
        this.putBack = this.putBack.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSkip = this.handleSkip.bind(this);
        this.handleNextPlayer = this.handleNextPlayer.bind(this);
    }


    async getCards(cardIds) {
        return Promise.all(
            cardIds.map((cardId) => {
                return db.ref(`cards/${cardId}`).once('value')
                    .then((cardSnap) => {
                        return { id: cardSnap.key, data: cardSnap.val() };
                    })
            })
        )
    }

    async getCardsForDeck(deckId) {
        db.ref(`decks/${deckId}/cards`)
            .orderByChild('drawable')
            .equalTo(true)
            .on('value', async snapshot => {
                const cardIds = [];
                snapshot.forEach((snap) => {
                    cardIds.push(snap.key)  
                })
                const cards = await this.getCards(cardIds)
                
                this.setState({
                    cards: cards
                })
            });
    }

    async componentDidMount() {
        this.setState({ error: null });

        try {
            console.log('in read, deckid', this.props.deckId)
            this.getCardsForDeck(this.props.deckId);
        } catch(error) {
            this.setState({ error: error.message })
        }
    }

    async handleChoose(event) {
        this.setState({ error: null });
        let card;
        try {
            if(this.state.currentCard) {
                this.setState({
                    cardsGotten: this.state.cardsGotten + 1,
                    currentCard: null
                })
            }
            card = drawRandomCard(this.state.cards)
        } catch(error) {
            this.setState({ error: error.message })
            return
        }

        await db.ref(`decks/${this.props.deckId}/cards/${card.id}`).update({
            drawable: false
        })
        this.setState({
            currentCard: card
        })
    }

    async handleReset(event) {
        this.setState({ error: null });

        const cardIds = [];
        db.ref(`decks/${this.props.deckId}/cards`).once('value', snapshot => {
            snapshot.forEach((child) => {
                cardIds.push(child.key)
                child.ref.update({
                    drawable: true,
                    skipped: false
                })
            })

            this.setState({
                currentCard: null
            })
        })
    }

    handleSkip(event) {
        this.setState({ error: null});

        if (!this.state.currentCard) {
            this.setState({
                error: 'There\'s nothing to skip, goober'
            })
            return
        }

        db.ref(`decks/${this.props.deckId}/cards/${this.state.currentCard.id}`).once('value', snapshot => {
            snapshot.ref.update({
                drawable: false,
                skipped: true
            })

            this.setState({
                currentCard: null
            })
        });
    }

    putBack(event) {
        this.setState({ error: null });
        if (!this.state.currentCard) {
            this.setState({
                error: 'You have to draw a card to put it back!'
            })
            return
        }

        db.ref(`decks/${this.props.deckId}/cards/${this.state.currentCard.id}`).once('value', snapshot => {
            snapshot.ref.update({
                drawable: true
            })

            this.setState({
                currentCard: null
            })
        });
    }

    handleNextPlayer() {
        db.ref(`decks/${this.props.deckId}/cards`)
        .orderByChild('skipped')
        .equalTo(true)
        .on('value', async snapshot => {
            snapshot.forEach((snap) => {
                snap.ref.update({
                    skipped: false,
                    drawable: true
                })  
            })
        });
    }
    

    render() {
        return (
            <div>
                <UserContext.Consumer>
                    {
                        ({ user }) => (
                            <div>
                                { this.state.cards.map((card, index) => {
                                    return <p key={index}>{card.data.text}</p>
                                }) }
                                {
                                    user.role === "HOST"
                                        ? <div><button onClick={ this.handleReset }>Reset</button><button onClick={ this.handleNextPlayer }>Next player</button></div>
                                        : null
                                }
                                <div>
                                    <h2>CURRENT CARD</h2>
                                    <div className="card">{ this.state.currentCard ? this.state.currentCard.data.text : null }</div>
                                </div>
                                <div>
                                    <button onClick={ this.handleChoose }>{ this.state.currentCard ? 'SUCCESS' : 'Draw card' }</button>
                                    <button onClick={ this.putBack }>Put card back</button>
                                    {/* <button onClick={ this.handleSkip }>Skip</button> */}
                                </div>
                                    {/* <h3>CARDS GOTTEN: {this.state.cardsGotten}</h3> */}
                                    <h3>CARDS LEFT: {this.state.cards.length}</h3>
                                {
                                    this.state.error
                                        ? <div><p>ERROR: {this.state.error}</p></div>
                                        : null
                                }
                            </div>
                        )
                    }
                </UserContext.Consumer>
            </div>
        )
    }
}