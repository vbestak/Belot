/* eslint-disable no-unused-vars */
module.exports = class Player{
    constructor(id, name, slot){
        this.id = id;
        this.slot = slot;
        this.name = name;
        this.hand = [];
    }
}