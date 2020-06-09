<template>
    <div id="hand-container">
        <div v-for="(card, index) in cards" :key="index" @click="playCard(card)">
            <Card :card="card"/>
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
       }
   }
}
</script>


<style scoped>
#hand-container{
    display: flex;
    height: fit-content;
    border: 2px solid grey;
}
#hand-container > * {
    display: inline-block;
}
</style>