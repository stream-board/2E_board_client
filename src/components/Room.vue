<template>
  <div class="room">
    <h1 class="name">Room: {{ $route.params.roomid }}</h1>
    <board id="board-container"></board>
    <actions id="actions-container"></actions>
    <cameras id="video-container"></cameras>
    <chat id="chat-container"></chat>
  </div>
</template>

<script>
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
