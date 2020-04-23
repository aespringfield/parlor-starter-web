import cloneDeep from 'lodash.clonedeep';

const random = (min, max) => {  
    return Math.floor(Math.random() * (max + 1 - min)) + min;  
} 

export const drawRandomCard = (cards) => {
    if (cards.length === 0) {
        throw new Error('No cards to draw')
    }

    const i = random(0, cards.length-1)
    console.log(i)
    const card = cloneDeep(cards[i])
    // const otherCards = cards.slice(0, i).join(cards.slice(i + 1, cards.length))
    return card;
}