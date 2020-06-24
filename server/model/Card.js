/* eslint-disable no-unused-vars */
module.exports = class Card{
    colors = ["hrc", "kara", "pik", "tref"];
    values = ["sedam", "osam", "devet", "deset", "dečko", "baba", "kralj", "as"];
    scoreValues = {
        "sedam":0,
        "osam": 0, 
        "devet": 0,
        "devetAdut": 14, 
        "dečko": 2,
        "dečkoAdut": 20,
        "baba": 3, 
        "kralj": 4, 
        "deset": 10,
        "as": 11
    }

    getAllCards(){
        let cards = []; 

        this.colors.forEach( color => {
            this.values.forEach( value => {
                let colorShort = color.substr(0, 1);
                cards.push(colorShort + value);
            });
        });
        return cards;
    }

    getScoreValue(card){
        return this.scoreValues[
            card.slice(1, card.length)
        ];
    }
}