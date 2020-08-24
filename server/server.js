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
const {
    callbackify
} = require('util');
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
    players.push(new playerI(socket.id, "Anonymous(:"));

    if (players.length == 4) startGame();

    socket.on('playCard', (data) => {
        playCard(socket, data)
    });

    socket.on('passTrumpCalling', passTrumpCalling);

    socket.on("call-trump", (data) => {
        game.trumpCalling = false;
        game.trump = data.slice(0, 1);
        game.playerCalled = {name: players[game.playerSlotTurn].name, slot: game.playerSlotTurn};
        game.playerSlotTurn = game.playerSlotShuffling+1;
        if (game.playerSlotTurn > 3) game.playerSlotTurn = 0;
        sendGameToAllPlayers();
    });

    socket.on('disconnect', function () {
        console.log('Got disconnect!');

        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        i = players.findIndex(player =>  player.id == socket.id);
        players.splice(i, 1);
    });

    socket.emit("customEmit", "hello there (: ");

});

function passTrumpCalling() {
    game.playerSlotTurn++;
    sendGameToAllPlayers();
}

function shuffleCards() {
    players.forEach((player, index) => {
        player.hand = deck.deck.slice(8 * index, 8 * index + 8);
    });
}


function clearTrump() {
    game.trump = "";
    game.trumpCalling = true;
}

function startGame() {

    for (let i = 0; i < 4; i++) {
        players[i].slot = i;
    }

    deck = new deckI();
    game.playerSlotShuffling = 3;
    game.playerSlotTurn = 0;

    let cleanedPlayers = JSON.parse(JSON.stringify(players));
    cleanedPlayers.forEach( player => delete player.hand);
    game.players = cleanedPlayers;

    clearTrump();
    shuffleCards();
    clearCardSlots();
    resetScore();
    sendGameToAllPlayers();
}

function resetScore() {
    game.score = {
        mi: 0,
        vi: 0,
        total: {
            mi: 0,
            vi: 0
        }
    };
}

function updateScoreAndSetNextPlayer() {
    let biggest = game.cardSlots.cardSlot1;
    let biggestSlot = "cardSlot1";
    let trumpInitial = game.trump.slice(0, 1);
    let totalValue = 0;

    if (checkIfHandsAreEmpty()) {
        totalValue += 10;
     }
     
    for (let slot in game.cardSlots) {
        let currentCard = game.cardSlots[slot];
        let biggestCardValue = card.getScoreValue(addFlagIfTrumpCard(biggest)),
            currentCardValue = card.getScoreValue(addFlagIfTrumpCard(currentCard));

        let evaluateCards = (currentCardValue, biggestCardValue) => {
            if (currentCardValue > biggestCardValue) {
                biggest = currentCard;
                biggestSlot = slot;
            }
        }

        totalValue += currentCardValue;

        if( (game.cardSlots[`cardSlot${game.playerSlotStarting+1}`].slice(0, 1) != game.cardSlots[slot].slice(0, 1))
            && (game.cardSlots[slot].slice(0, 1) != trumpInitial)) continue; 

        if (biggest.slice(0, 1) != trumpInitial) {
            if(currentCard.slice(0, 1) == trumpInitial) {
                biggest = currentCard;
                biggestSlot = slot;
            } else {
                evaluateCards(currentCardValue,biggestCardValue)
            }
        } else if (biggest.slice(0, 1) == trumpInitial)
            if (currentCard.slice(0, 1) != trumpInitial) continue;
            else {
                evaluateCards(currentCardValue,biggestCardValue)
            }
    }
    
    let playerCollected = biggestSlot.match(/\d/) - 1;
    game.playerSlotTurn = playerCollected;
    game.playerSlotStarting = playerCollected;

    if (playerCollected == 0 || playerCollected == 2) {
        game.score.mi += totalValue;
    } else {
        game.score.vi += totalValue;
    }

    if (checkIfHandsAreEmpty()) {
        calculateTotalScore();
        shuffleCards();
        setNewMatch()
    }
}

function calculateTotalScore(){
    if(game.playerCalled.slot == 0 || game.playerCalled.slot == 2){
        if(game.score.mi > game.score.vi){
            game.score.total.mi += game.score.mi;
            game.score.total.vi += game.score.vi;
        }else{
            game.score.total.vi += game.score.vi + game.score.mi;
        }
    }else{
        if(game.score.vi > game.score.mi){
            game.score.total.vi += game.score.vi;
            game.score.total.mi += game.score.mi;
        }else{
            game.score.total.mi += game.score.vi + game.score.mi;
        }
    }

}

function setNewMatch() {
    game.playerSlotShuffling += 1;
    if (game.playerSlotShuffling >= 4) game.playerSlotShuffling = 0;

    game.playerSlotTurn = game.playerSlotShuffling+1;
    if (game.playerSlotTurn > 4) game.playerSlotTurn = 0;

    game.playerSlotStarting = game.playerSlotTurn;
    clearTrump();
}

function checkIfHandsAreEmpty() {
    return players.map(player => player.hand).filter(hand => hand.length > 0).length == 0;
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

    ///Check if card turn valid
    //check if card foolows color
    //check if player has stronger card
    //if player doesnt have  card color check if he has trump
    // if no trump valid

    let index = players.map(player => player.id).indexOf(socket.id);
    if (game.playerSlotTurn != players[index].slot) return;

    let cardIndex = players[index].hand.indexOf(data);
    if (cardIndex < 0) return;
    else players[index].hand.splice(cardIndex, 1);

    let slot = game.playerSlotTurn;
    game.cardSlots[`cardSlot${slot+1}`] = data
    
    game.playerSlotTurn++;
    if (game.playerSlotTurn > 3) game.playerSlotTurn = 0;

    sendGameToAllPlayers();

    (function () {
        let nextSlotFilled;
        let nextSlot = slot++ >= 3 ? 0 : slot;

        if (game.cardSlots[`cardSlot${nextSlot+1}`] != "") {
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
    if (index > 4 || index == -1) return;

    individualGame.playerId = index;
    individualGame.playerCards = players[index].hand;
    individualGame.cardSlots = setCardSlotsDependingOnPlayerSlot(index, game.cardSlots);
    individualGame.trumpCalling = setTrumpCallDependingOnPlayerSlot(index, game)
    individualGame.players = setPlayerNamesDependingOnPlayerSlot(index, game.players);

    if(game.trumpCalling){
        individualGame.playerCards = JSON.parse(JSON.stringify(individualGame.playerCards));
        individualGame.playerCards[6] = "cardBack";
        individualGame.playerCards[7] = "cardBack";
    }

    return individualGame;
}

function setPlayerNamesDependingOnPlayerSlot(index, players){
    let orderedPlayers = [];
    if(index == 0) return players;

    else{
        orderedPlayers = orderedPlayers.concat(players.slice(index));
        orderedPlayers = orderedPlayers.concat(players.slice(0, index));
        return orderedPlayers;
    }
}

function setTrumpCallDependingOnPlayerSlot(index, game) {
    if (game.trumpCalling) return (index == game.playerSlotTurn) ? true : false;
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