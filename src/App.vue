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
  box-sizing: border-box;
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

@font-face {
  font-family: 'Icons';
  src:  url('./assets/fonts/Icons.eot?kkiwn0');
  src:  url('./assets/fonts/Icons.eot?kkiwn0#iefix') format('embedded-opentype'),
    url('./assets/fonts/Icons.ttf?kkiwn0') format('truetype'),
    url('./assets/fonts/Icons.woff?kkiwn0') format('woff'),
    url('./assets/fonts/Icons.svg?kkiwn0#Icons') format('svg');
  font-weight: normal;
  font-style: normal;
}

[class^="sb-"], [class*=" sb-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'Icons' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.sb-eraser:before {
  content: "\e900";
}
.sb-ray-start-end:before {
  content: "\e901";
}
</style>
