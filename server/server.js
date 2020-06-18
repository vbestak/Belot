/* eslint-disable no-unused-vars */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config');
const port = config.port;

let server = require('http').Server(app);
let io = require('socket.io')(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let playerI = require("./model/Player");
let gameI = require("./model/Game");
let deckI = require("./model/Deck");
let players = [];
let game, deck;
game = gameI;
let allClients = [];
const connectionsLimit = 4;

io.on('connect', function (socket) {
    console.log("Connected succesfully to the socket ...");

    if (io.engine.clientsCount > connectionsLimit) {
        socket.emit('err', {
            message: 'reach the limit of connections'
        })
        socket.disconnect()
        console.log('Disconnected...')
        return
    }

    allClients.push(socket);
    players.push(new playerI(socket.id, "Anonymous", players.length));

    if (players.length == 4) startGame();

    socket.on('playCard', (data)=>{playCard(socket, data)});

    socket.on('disconnect', function () {
        console.log('Got disconnect!');

        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        i = players.map(player => player.id).indexOf(socket.playerId);
        players.splice(i, 1);
    });

    socket.emit("customEmit", "hello there (: ");

});

function startGame() {
    deck = new deckI();

    players.forEach((player, index) => {
        player.hand = deck.deck.slice(8 * index, 8 * index + 8);
    });

    console.log(players);
    allClients.forEach(client => {
        client.emit("game", sendGameToPlayers(client))
    });
}

function playCard(socket, data) {
    if(!data) return;
    
    let index = players.map(player => player.id).indexOf(socket.id);
    if(game.playerSlotTurn != players[index].slot) return;
    
    //TODO do stuff
    console.log(data + "---played card");

    let slot = game.playerSlotTurn;
    if (slot == 0) game.cardSlots.cardSlot1 = data;
    else if (slot == 1) game.cardSlots.cardSlot2 = data;
    else if (slot == 2) game.cardSlots.cardSlot3 = data;
    else if (slot == 3) game.cardSlots.cardSlot4 = data;

    game.playerSlotTurn++;

    allClients.forEach(client => {
        client.emit("game", sendGameToPlayers(client))
    });
}

function sendGameToPlayers(client) {
    let individualGame = JSON.parse(JSON.stringify(game));
    let index = players.map(player => player.id).indexOf(client.id);
    if (index > 4) return;

    individualGame.playerCards = players[index].hand;
    individualGame.cardSlots = setCardSlotsDependingOnPlayerSlot(index, game.cardSlots);
    return individualGame;
}

function setCardSlotsDependingOnPlayerSlot(playerSlot, cardSlots){
    const CARD_SLOTS = 4;
    let orderdCardSlots = {
        cardSlot1: "",
        cardSlot2: "",
        cardSlot3: "",
        cardSlot4: ""
    };

    if(playerSlot == 0) return cardSlots;
    else{
        for(let i = 0; i <= CARD_SLOTS; i++){
            let slot = i+playerSlot;
            if(slot > CARD_SLOTS) slot-=CARD_SLOTS;

            orderdCardSlots[`cardSlot${i}`] = cardSlots[`cardSlot${slot}`];
        }
    }
    
    return orderdCardSlots;
}

app.get('/', (req, res) => {
    res.send("welcome to belot made by valetnino beštak");
});


server.listen(port);
console.log('Running on port ' + port);