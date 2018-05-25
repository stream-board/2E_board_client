<template>
  <div class="board-container">
    <div id="canvas-container">
        <canvas id="board" height="720" width="1280"></canvas>
    </div>
  </div>
</template>

<script src="./Board.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .board-container{
        z-index: 2;
        background-color: #174557;
        width: 100%;
        height: 100%;
        position: absolute;
        #canvas-container{
            background-color: #FFF;
            border-radius: 2vh;
            height: 95%;
            width: 95%;
            position: absolute;
            top: 2.5%;
            left: 2.5%;
            #board{
                border-radius: 2vh;
                position: absolute;
                top: 0;
                left: 0;
                background-color: #FFF;
                height: 100%;
                width: 100%;
            }
        }
        #thickness{
            position: absolute;
            top: 10px;
            right: 10px;
            color: #FFF;
        }
        #type{
            position: absolute;
            top: 40px;
            right: 10px;
            color: #FFF;
        }
        #color{
            position: absolute;
            top: 65px;
            right: 10px;
        }
        #nick{
            position: absolute;
            top: 100px;
            right: 10px;
        }
        #actions {
            position: absolute;
            top: 150px;
            right: 10px;
        }
        #admin-actions {
            position: absolute;
            top: 150px;
            right: 10px;
        }
    }
</style>
