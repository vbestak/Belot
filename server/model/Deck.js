/* eslint-disable no-unused-vars */
let Card = require("./Card");

module.exports = class Deck{
    constructor(){
        this.deck = new Card().getAllCards();
        this.shuffleDeck();
    }

    shuffleDeck(){  
        let j, x, i;
        for (i = this.deck.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = x;
        }
    }
}