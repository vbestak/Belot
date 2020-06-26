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

let cardI = require("./model/Card");
let card = new cardI();
let playerI = require("./model/Player");
let gameI = require("./model/Game");
let deckI = require("./model/Deck");
let players = [];
let game = gameI,
    deck;
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

    socket.on('playCard', (data) => {
        playCard(socket, data)
    });

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
    clearCardSlots();
    sendGameToAllPlayers();
}

function updateScoreAndSetNextPlayer() {
    let biggest = "";
    let biggestSlot = "";

    for (let slot in game.cardSlots) {
        console.log(`biggest = ${biggest} at ${biggestSlot} - curr slot=${slot}`);
        if ((biggest.slice(0, 1) != game.trump.slice(0, 1)) && 
            (game.cardSlots[slot].slice(0, 1) == game.trump.slice(0, 1))){
                biggest = game.cardSlots[slot];
                biggestSlot = slot;
        }

        else if (biggest.slice(0, 1) == game.trump.slice(0, 1))
            if (game.cardSlots[slot].slice(0, 1) != game.trump.slice(0, 1)) continue;
            else if (card.getScoreValue(addFlagIfTrumpCard(game.cardSlots[slot])) >
                     card.getScoreValue(addFlagIfTrumpCard(biggest))) {
                        biggest = game.cardSlots[slot];
                        biggestSlot = slot;
            }
    }

    console.log(`biggest = ${biggest} at ${biggestSlot}`);
    game.playerSlotTurn = biggestSlot.slice(biggestSlot.length - 1, biggestSlot.length) - 1;
}

function addFlagIfTrumpCard(card) {
    let trumpFlag = "Adut";
    let trump = game.trump;

    if ((card.slice(1, card.length) == "dečko") || (card.slice(1, card.length) == "devet"))
        if (trump.slice(0, 1) == card.slice(0, 1)) return card + trumpFlag;

    return card;
}

function clearCardSlots() {
    for (let cardSlot in game.cardSlots) {
        game.cardSlots[cardSlot] = "";
    }
}

function playCard(socket, data) {
    if (!data) return;

    let index = players.map(player => player.id).indexOf(socket.id);
    if (game.playerSlotTurn != players[index].slot) return;

    let cardIndex = players[index].hand.indexOf(data);
    if (cardIndex < 0) return;
    else players[index].hand.splice(cardIndex, 1);

    //TODO do stuff
    console.log(data + "---played card");

    let slot = game.playerSlotTurn;
    if (slot == 0) game.cardSlots.cardSlot1 = data;
    else if (slot == 1) game.cardSlots.cardSlot2 = data;
    else if (slot == 2) game.cardSlots.cardSlot3 = data;
    else if (slot == 3) game.cardSlots.cardSlot4 = data;

    game.playerSlotTurn++;
    if (game.playerSlotTurn > 3) game.playerSlotTurn = 0;

    sendGameToAllPlayers();

    (function () {
        let nextSlotFilled;
        let nextSlot = slot++ >= 3 ? 0 : slot;

        if (game.cardSlots[`cardSlot${nextSlot+1}`]) {
            setTimeout(
                function () {
                    updateScoreAndSetNextPlayer();
                    clearCardSlots();
                    sendGameToAllPlayers();
                },
                500
            );
        }
    })()
}

function sendGameToAllPlayers() {
    allClients.forEach(client => {
        client.emit("game", sendGameToPlayer(client))
    });
}

function sendGameToPlayer(client) {
    let individualGame = JSON.parse(JSON.stringify(game));
    let index = players.map(player => player.id).indexOf(client.id);
    if (index > 4) return;

    individualGame.playerCards = players[index].hand;
    individualGame.cardSlots = setCardSlotsDependingOnPlayerSlot(index, game.cardSlots);
    return individualGame;
}

function setCardSlotsDependingOnPlayerSlot(playerSlot, cardSlots) {
    const CARD_SLOTS = 4;
    let orderdCardSlots = {
        cardSlot1: "",
        cardSlot2: "",
        cardSlot3: "",
        cardSlot4: ""
    };

    if (playerSlot == 0) return cardSlots;
    else {
        for (let i = 0; i <= CARD_SLOTS; i++) {
            let slot = i + playerSlot;
            if (slot > CARD_SLOTS) slot -= CARD_SLOTS;

            orderdCardSlots[`cardSlot${i}`] = cardSlots[`cardSlot${slot}`];
        }
    }

    return orderdCardSlots;
}

app.get('/', (req, res) => {
    res.send("welcome to belot made by valentino beštak");
});


server.listen(port);
console.log('Running on port ' + port);