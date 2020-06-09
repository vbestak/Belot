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

io.on('connect', function (socket) {
    console.log("Connected succesfully to the socket ...");
    allClients.push(socket);

    players.push(new playerI(socket.id, players.length));

    if(players.length == 4){
        deck = new deckI();
        console.log(deck);
        players.forEach( (player, index) => {
            player.hand = deck.deck.slice(0*index, 0*index + 8);
        });

        console.log(players);
        allClients.forEach( client => {
            client.emit("game", sendGameToPlayers(client))
        });
    }

    socket.on('amejzing', function(data) {
        allClients.forEach( client => {
            client.emit("game", sendGameToPlayers(client))
        });
        console.log("wooooow");
    })

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
  
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        i = players.map( player => player.id).indexOf(socket.playerId);
        players.splice(i, 1);
     });

    socket.emit("customEmit", "hello there (: ");

});

function sendGameToPlayers(client){
    let index = players.map( player => player.id).indexOf(client.id);
    if (index < 3)game.playerCards = players[index].hand;
    return game;
}

app.get('/', (req, res) => {
    res.send("welcome to belot made by valetnino beštak");
});


server.listen(port);
console.log('Running on port ' + port);