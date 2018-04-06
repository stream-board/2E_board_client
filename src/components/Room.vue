<template>
  <div class="room">
    <board id="board-container"></board>
    <actions :room="room" id="actions-container"></actions>
    <cameras id="video-container"></cameras>
    <chat id="chat-container"></chat>
  </div>
</template>

<script>
import { ROOM_BY_ID_QUERY } from '../constants/graphql'
import Board from '@/components/Board.vue'
import Actions from '@/components/Actions.vue'
import Chat from '@/components/Chat.vue'
import Video from '@/components/Video.vue'

export default {
  name: 'Room',
  components: {
    'board': Board,
    'actions': Actions,
    'chat': Chat,
    'cameras': Video
  },
  data: () => ({
    room: {}
  }),
  created () {
    this.$apollo.query({
      query: ROOM_BY_ID_QUERY,
      variables: {
        id: this.$route.params.roomid
      }
    }).then((result) => {
      this.room = result.data.roomById
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .room{
      background-color: #000;
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
    #video-container{
      position: absolute;
      top: 0;
      right: 0;
      height: 40%;
      width: 25%;
    }
    #chat-container{
      position: absolute;
      bottom: 0;
      right: 0;
      height: 60%;
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
