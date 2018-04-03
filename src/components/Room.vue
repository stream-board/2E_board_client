<template>
  <div class="room">
    <h1 class="name">Room: {{ $route.params.roomid }}</h1>
    <board id="board-container"></board>
  </div>
</template>

<script>
import Board from '@/components/Board.vue'
export default {
  name: 'Room',
  components: {
    'board': Board
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
      height: 70%;
    }
</style>
