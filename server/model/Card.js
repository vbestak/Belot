/* eslint-disable no-unused-vars */
module.exports = class Card{
    colors = ["hrc", "kara", "pik", "tref"];
    values = ["sedam", "osam", "devet", "deset", "dečko", "baba", "kralj", "as"];

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
}