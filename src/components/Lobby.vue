<template>
<v-container>
  <h1>{{ msg }}</h1>
  <v-text-field
    name="room-id"
    label="Room Id"
    id="room-id"
    v-model="roomId"
  ></v-text-field>
  <v-btn color="primary" @click="joinRoom()">Join room {{roomId}}</v-btn>
  <v-btn color="primary" @click="createRoom()">Create room {{roomId}}</v-btn>
  <v-btn color="primary" @click="emitEvent()">Emit Event</v-btn>
  <v-snackbar
    color="error"
    v-model="snackbar"
    >
    {{ message }}
    <v-btn dark flat @click.native="snackbar = false"><v-icon>close</v-icon></v-btn>
  </v-snackbar>
</v-container>
</template>

<script>
import { CREATE_BOARD_ROOM_MUTATION } from '../constants/graphql'

export default {
  name: 'Lobby',
  data () {
    return {
      roomId: '',
      nick: '',
      msg: 'Welcome to the StreamBoard lobby',
      snackbar: false,
      message: 'Error while creating room',
      clickCount: 0
    }
  },
  methods: {
    joinRoom () {
      this.$router.push({path: `/app/${this.roomId}`})
    },
    createRoom () {
      let user = JSON.parse(localStorage.getItem('user'))
      this.$apollo.mutate({
        mutation: CREATE_BOARD_ROOM_MUTATION,
        variables: {
          id: this.roomId,
          admin: user.id
        }
      }).then((response) => {
        console.log(response)
        this.$router.push({path: `/app/${this.roomId}`})
      }).catch((error) => {
        console.log(error)
        this.snackbar = true
      })
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
