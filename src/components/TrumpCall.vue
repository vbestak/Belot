<template>
  <div class="call-container">
      <div class="colors-container">
        <div>
            <img src="../../public/assets/boje/herc.png" alt="hrc">
        </div>
      
        <div>
            <img src="../../public/assets/boje/kara.png" alt="kara">
        </div>
      
        <div>
          <img src="../../public/assets/boje/pik.png" alt="pik">
        </div>

        <div>
            <img src="../../public/assets/boje/tref.png" alt="tref">
        </div>
      </div>
      
      <div>
          <button id="button-next">Dalje!</button>
      </div>
  </div>
</template>

<script>
import Game from '../game-mock'

export default {
    props:{
        game: Game
    }
}
</script>

<style>
#button-next{
    width: 5em;
    padding: 8px;
}
.call-container{
    padding: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: fit-content;
    max-width: 500px;
    height: fit-content;
    border: 3px solid grey;
}
.colors-container{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    width: 100%;
}
.colors-container > div{
    padding: 4px;
    cursor: pointer;
}

.colors-container > div > img {
    width: 72px;
}
</style>