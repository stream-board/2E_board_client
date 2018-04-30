<template>
  <div class="room">
    <board id="board-container"></board>
    <actions :room="room" id="actions-container"></actions>
    <cameras id="streaming-container"></cameras>
    <chat :room="room" id="chat-container"></chat>
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
import { ROOM_BY_ID_QUERY, DELETE_ROOM_MUTATION, EXIT_ROOM_MUTATION } from '../constants/graphql'
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
    snackbar: false,
    admin: false
  }),
  apollo: {
    room: {
      query: ROOM_BY_ID_QUERY,
      variables () {
        return {
          id: this.$route.params.roomid
        }
      },
      update (data) {
        return data.roomById
      },
      result (result) {
        this.message = `Welcome to ${this.room.nameRoom}`
        this.snackbar = true
      },
      fetchPolicy: 'network-only'
    }
  },
  mounted () {
    this.$bus.on('new-participant', (data) => {
      if (data.message.split(' ')[0] !== `${this.user.nickname}`) {
        this.message = data.message
        this.snackbar = true
      }
    })
    this.$bus.on('user-disconnected', (data) => {
      if (data) {
        this.message = `User ${data} disconnected`
        this.snackbar = true
      }
    })
    this.$bus.on('new-drawer', (data) => {
      this.message = `${data} is now drawing`
      this.snackbar = true
    })
    this.$bus.on('set-admin', () => {
      this.admin = true
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.admin) {
      this.$swal({
        title: 'Leaving room',
        text: `You're the owner of the room, if you leave the room will be deleted and all the participants will be kicked. Are you sure you want to leave the room?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#26d3cd',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          console.log('Yes')
          this.$bus.emit('user-disconnected')
          this.$apollo.mutate({
            mutation: DELETE_ROOM_MUTATION,
            variables: {
              idOwner: this.user.id,
              idRoom: this.room.idRoom
            }
          }).then((response) => {
            console.log('Success')
            next()
          }).catch((error) => {
            console.log(error)
          })
        } else {
          console.log('No')
          next(false)
        }
      })
    } else {
      this.$apollo.mutate({
        mutation: EXIT_ROOM_MUTATION,
        variables: {
          idOwner: this.user.id,
          idRoom: this.room.idRoom
        }
      }).then((response) => {
        console.log('Success')
        this.$bus.emit('user-disconnected')
        next()
      }).catch((error) => {
        console.log(error)
        next()
      })
    }
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
      height: 50%;
      width: 25%;
    }
    #chat-container{
      position: absolute;
      bottom: 0;
      right: 0;
      height: 50%;
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
