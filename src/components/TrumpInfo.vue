<template>
  <div id="trumpinfo-container" v-if="trump">
      <div>
        <img :src="'/assets/boje/'+trumpName(trump)+'.png'" alt="adut" width="65%">
      </div>
      <div>
          Zvao: {{ playerCalled.name }}
      </div>
  </div>
</template>

<script>
export default {
    props:{
        trump: String,
        playerCalled: Object
    },
    methods:{
        trumpName(trump){
            if(trump == 'h') return 'herc'
            else if(trump == 'k') return 'kara'
            else if(trump == 'p') return 'pik'
            else if(trump == 't') return 'tref'
        }
    }
}
</script>

<style>
#trumpinfo-container{
    width: 100%;
    max-width: 125px;
    min-width: 80px;
    display: flex;
    align-content: center;
    justify-items: center;
    flex-direction: column;
}


</style>