<template>
  <div class="streaming-container">
    <div id="all-videos">
        <p id="demo"></p>
        <p id="muted">asd</p>
    </div>
    <div id="actions">
        <button @click="amIMaster()">Soy administrador?</button>
        <button @click="askForWord()">Pedir la palabra</button>
        <button @click="muteAll()">Silenciar clientes</button>
        <button @click="toggleVideo()">On/Off video</button>
    </div>
  </div>
</template>

<script src="./Streaming.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .streaming-container{
        z-index: -1;
        background-color: #555;
        width: 100vw;
        height: 100vh;
        position: absolute;
        #streaming{
            position: absolute;
            top: 0;
            left: 0;
            background-color: #FFF;
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
            position: relative;
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
