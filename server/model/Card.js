/* eslint-disable no-unused-vars */
module.exports = class Card{
    colors = ["Hrc", "Kara", "Pik", "Tref"];
    values = ["7", "8", "9", "t10", "Dečko", "Baba", "Kralj", "As"];

    getAllCards(){
        let cards = []; 

        this.colors.forEach( color => {
            this.values.forEach( value => {
                let colorShort = color.substr(0, 1);
                let valueShort = value.substr(0, 1);
                cards.push(colorShort + valueShort);
            });
        });
        return cards;
    }
}