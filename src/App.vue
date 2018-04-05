<template>
  <v-app id="app-container">
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false
  }),
  props: {
    source: String
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
}
#app-container{
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
