<template>
    <div id="table-container">
        <div id="table">
            <Card v-if="playedCards['cardSlot1'] != ''" :card="playedCards['cardSlot1']" id="card-slot-1"/>
            <Card v-if="playedCards['cardSlot2'] != ''" :card="playedCards['cardSlot2']" id="card-slot-2"/>
            <Card v-if="playedCards['cardSlot3'] != ''" :card="playedCards['cardSlot3']" id="card-slot-3"/>
            <Card v-if="playedCards['cardSlot4'] != ''" :card="playedCards['cardSlot4']" id="card-slot-4"/>
        </div>
    </div>
</template>


<script>
import Card from "@/components/Card.vue"

export default {
    components:{
        Card
    },
    props:{
        playedCards: Object
    }
}
</script>


<style>
#card-slot-4{
    grid-area: card-slot-4;
    justify-self: end;
    align-self: center;
}
#card-slot-3{
    grid-area: card-slot-3;
    justify-self: center;
    align-self: center;
}
#card-slot-2{
    grid-area: card-slot-2;
    justify-self: start;
    align-self: center;
}
#card-slot-1{
    grid-area: card-slot-1;
    justify-self: center;
    align-self: center;
}
#table-container{
    box-sizing: border-box;
    display: flex;
    align-content: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 36px;
}

#table{
    background-color: lightgreen;
    border: 12px solid grey;
    width: 100%;
    height: 100%;
    min-width: 480px;
    max-width: 1200px;
    min-height: 400px;
    max-height: 415px;
    border-radius: 120px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 
    ". . . . ."
    ". . card-slot-3 . ."
    ". card-slot-4 . card-slot-2 ."
    ". . card-slot-1 . ."
    ". . . . .";
}

</style>