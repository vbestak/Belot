<template>
    <div id="hand-container">
        <div v-for="n in 8" :key="n">
            <Card :style="{'visibility': showCard(n-1)? 'visible': 'hidden'}" v-hidden="showCard(n-1)" :card="cards[n-1]"/>
        </div>
    </div>
</template>


<script>
import Card from "@/components/Card.vue";

export default {
    components: {
        Card
    },
    props: {
        cards: Array
    },
    data(){
        return{
            
        }  
   },
   methods: {
       playCard(card){
           this.$emit("play-card", card);
       },
       showCard(n){
           return (this.cards[n] != undefined) && (this.cards != '');
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
    padding: .5px;
}
</style>