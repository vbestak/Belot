<template>
    <div id="game-container">
        <Table :playedCards="game.cardSlots" id="table-slot" />
        <Player id="player-4" class="player" />
        <Player id="player-3" class="player" />
        <Player id="player-2" class="player" />
        <div id="player-1" class="player">
            <Player style="margin: 0 12px 0 -62px;"/>
            <PlayerHand @play-card="playCard" :cards="game.playerCards" class="player-hand-slot"/>
        </div>
        <Score id="score-slot"/>
    </div>
</template>


<script>
import Table from "@/components/Table.vue"
import Player from "@/components/Player.vue"
import Score from "@/components/Score.vue"
import PlayerHand from "@/components/PlayerHand.vue"
import Game from "../game-mock.js"

export default {
    components:{
        Table,
        Player,
        Score,
        PlayerHand
    },
    data(){
        return {
            game: Game
        }
    },sockets: {
        connect() {
            console.log('socket connected')
        },
        customEmit(val) {
            console.log(val + 'this method was fired by the socket server. eg: io.emit("customEmit", data)')
         },
         game(val) {
           this.game = val;
           console.log(val);
         }
  },
    methods: {
        playCard(card){
            this.$socket.client.emit('amejzing', "amejzing");
            console.log(card + " --played card");
        }
    }
}
</script>


<style scoped>
.player-hand-slot{
    width: fit-content;
}
#score-slot{
    grid-area: score;
    align-self: flex-start;
    justify-self: end;
    padding: 0 16px 0;
}
.player{
    justify-self: center;
    align-self: center;
    padding: 2.5px;
}
#player-4{
    grid-area: player-4;
}
#player-3{
    grid-area: player-3;
}
#player-2{
    grid-area: player-2;
}
#player-1{
    grid-area: player-1;
    display: flex;
}
#table-slot{
    grid-area: table;
    display: flex;
    justify-content: center;
    align-content: center;
}
#game-container{
    display: grid;
    grid-template-rows: 1fr 4fr 1.5fr;
    grid-template-columns: 1fr 120px 1fr 120px 1fr;
    grid-template-areas: 
    ". . player-3 score ."
    ". player-4 table player-2 ."
    ". . player-1 . .";
}

</style>