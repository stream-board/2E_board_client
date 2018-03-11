<template>
  <div class="lobby">
    <h1>{{ msg }}</h1>
    <input type="text" v-model="roomId">
    <button @click="goToRoute()">Go to room {{roomId}}</button>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  data () {
    return {
      roomId: '',
      msg: 'Welcome to the StreamBoard lobby'
    }
  },
  methods: {
    goToRoute () {
      this.$router.push({name: 'Room', params: {roomid: this.roomId}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
