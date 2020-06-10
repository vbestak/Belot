<template>
    <div id="card-container">
        <div id="card">
            <img :src="'assets/'+card+'.png'" alt="card">
        </div>
    </div>
</template>


<script>
export default {
  props: {
      card: String
  }
}
</script>


<style>
#card-container{
    box-sizing: border-box;
    display: flex;  
    align-content: center;
    justify-content: center;
    width: 100%;
}

#card > img{
    width: 100%;
    height: 100%;
}

#card{
    width: 72px;
    height: 110px;
}
</style>