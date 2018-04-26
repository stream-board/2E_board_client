<template>
  <div class="streaming-container">
    <div id="local-container">
      <div id="local-video-actions">
        <v-tooltip top v-if="mic">
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="muteMic()">
            <v-icon>mic</v-icon>
          </v-btn>
          <span>Mute your microphone</span>
        </v-tooltip>
        <v-tooltip top v-if="!mic">
          <v-btn small class="elevation-10" slot="activator" outline fab color="error" @click="unmuteMic()">
            <v-icon>mic_off</v-icon>
          </v-btn>
          <span>Unmute your microphone</span>
        </v-tooltip>
        <v-tooltip v-if="cam" top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="blockCam()">
            <v-icon>videocam</v-icon>
          </v-btn>
          <span>Hide cam</span>
        </v-tooltip>
        <v-tooltip v-else-if="!cam" top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="error" @click="useCam()">
            <v-icon>videocam_off</v-icon>
          </v-btn>
          <span>Show cam</span>
        </v-tooltip>
      </div>
      <video id="localVideo"></video>
    </div>
    <carousel id="remote-container" loop :perPage="3" :navigationEnabled="true" :scrollPerPage="true" :paginationEnabled="false">
      <slide class="remoteVideo" v-for="video in videos" v-bind:key="video" :id="video">
      </slide>
    </carousel>
  </div>
</template>

<script src="./Streaming.js"></script>

<style lang="scss">
  .streaming-container{
    background-color: #174557;
  }
  #local-container{
    width: 100%;
    height: 70%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  #remote-container{
    width: 80%;
    left: 10%;
    height: 30%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #localVideo{
    border-radius: 10px;
    max-height: 95%;
  }
  .remoteVideo{
    max-height: 10vh;
    position: relative;
    cursor: pointer;
  }
  .remoteVideo video{
    height: 100%;
    width: 100%;
    border-radius: 10px;
    cursor: pointer;
  }
  #local-video-actions{
    position: absolute;
    bottom: 0;
    left: 10%;
    z-index: 10;
  }
  .overlay{
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.1);
    cursor: pointer;
    display: none;
  }
  .mute-icon{
    font-size: 48px;
    color: rgb(38, 211, 205)!important;
  }
  .unmute-icon{
    font-size: 48px;
    color: rgb(244, 67, 54)!important;
  }
  .overlay-active{
    z-index: 11;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px rgb(38, 211, 205);
  }
  .overlay-muted {
    border: solid 1px rgb(244, 67, 54);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
