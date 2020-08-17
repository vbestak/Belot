<template>
    <div id="hand-container">
        <div v-for="n in 8" :key="n" @click="playCard(sortedCards[n-1])">
            <Card  :style="{'visibility': showCard(n-1)? 'visible': 'hidden'}" :card="sortedCards[n-1]"/>
        </div>
    </div>
</template>


<script>
import Card from "@/components/Card.vue";

const cardValues = ["sedam", "osam", "devet", "deset", "dečko", "baba", "kralj", "as"];

export default {
    components: {
        Card
    },
    props: {
        cards: Array
    },
    computed:{
       sortedCards(){
           let hrc = [];
           let kara = [];
           let pik = [];
           let tref = [];
           let everythingElse = []

           this.cards.forEach(card => {
               switch(card.slice(0,1)){
                    case "h":
                        this.sortCard(hrc, card);
                        break;
                    case "k":
                        this.sortCard(kara, card);
                        break;
                    case "p":
                        this.sortCard(pik, card);
                        break;
                    case "t":
                        this.sortCard(tref, card);
                        break;
                    default:
                        everythingElse.push(card);
               }
           });

           //TODO card sorting
           return hrc.concat(kara, pik, tref, everythingElse);
       }
              
   },
   methods: {
       sortCard(cardArray, card){
            if(cardArray.length == 0){
               cardArray.push(card)
            }else{
                let arrayCardValue;
                let cardValue;
                for(let i=0; i<cardArray.length; i++){
                    arrayCardValue = cardValues.findIndex( c => c == cardArray[i].slice(1));
                    cardValue = cardValues.findIndex( c => c == card.slice(1));
                    if(arrayCardValue > cardValue){
                        cardArray.splice(i, 0, card);
                        break;
                    }else if(cardArray.length == i+1){
                        cardArray.push(card);
                        break;
                    }
                }
            } 
       },
       playCard(card){
           this.$emit("play-card", card);
       },
       showCard(n){
           return (this.sortedCards[n] != undefined) && (this.cards != '');
       }
   }
}
</script>


<style scoped>
#hand-container{
    display: flex;
    height: fit-content;
    border: 2px solid grey;
    padding: 6px;
}
#hand-container > * {
    display: inline-block;
    padding: 2px;
}
</style>