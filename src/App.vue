<template>
  <div id="app">
    <notifications
      group="responses"
      position="bottom right"/>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700,400i|Material+Icons'); // Roboto font

* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
