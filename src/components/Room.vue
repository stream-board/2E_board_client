<template>
  <div class="room">
    <board id="board-container"></board>
    <actions :room="room" id="actions-container"></actions>
    <cameras id="streaming-container"></cameras>
    <chat :room="room" :participants="room.Participants" id="chat-container"></chat>
    <v-snackbar
      color="info"
      v-model="snackbar"
      top
      >
      {{ message }}
      <v-btn dark flat @click.native="snackbar = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { ROOM_BY_ID_QUERY } from '../constants/graphql'
import Board from '@/components/Board.vue'
import Actions from '@/components/Actions.vue'
import Chat from '@/components/Chat.vue'
import Streaming from '@/components/Streaming.vue'
export default {
  name: 'Room',
  components: {
    'board': Board,
    'actions': Actions,
    'chat': Chat,
    'cameras': Streaming
  },
  data: () => ({
    room: {},
    user: JSON.parse(localStorage.getItem('user')),
    message: '',
    snackbar: false
  }),
  created () {
    this.$apollo.query({
      query: ROOM_BY_ID_QUERY,
      variables: {
        id: this.$route.params.roomid
      }
    }).then((result) => {
      this.room = result.data.roomById
      this.message = `Welcome to ${this.room.nameRoom}`
      this.snackbar = true
    }).catch((error) => {
      console.log(error)
    })
    this.$bus.on('new-participant', (data) => {
      if (data.message.split(' ')[0] !== `${this.user.nickname}`) {
        this.message = data.message
        this.snackbar = true
      }
    })
    this.$bus.on('user-disconnected', (data) => {
      this.message = `User ${data} disconnected`
      this.snackbar = true
    })
    this.$bus.on('new-drawer', (data) => {
      this.message = `${data} is now drawing`
      this.snackbar = true
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .room{
      background-color: #000;
      overflow: hidden;
    }
    .name{
      z-index: 3;
      position: absolute;
      right: 1vh;
      bottom: 22vh;
      color: #FFF;
    }
    #board-container{
      position: absolute;
      top: 0;
      left: 0;
      width: 75%;
      height: 90%;
    }
    #streaming-container{
      position: absolute;
      top: 0;
      right: 0;
      height: 60%;
      width: 25%;
    }
    #chat-container{
      position: absolute;
      bottom: 0;
      right: 0;
      height: 40%;
      width: 25%;
    }
    #actions-container{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 10%;
      width: 75%;
    }
</style>
