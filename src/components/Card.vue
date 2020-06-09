<template>
    <div id="card-container">
        <div id="card">
             {{ card }}
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
    height: 100%;
    padding: 6px;
}

#card{
    background-color: red;
    width: 60px;
    height: 90px;
}
</style>