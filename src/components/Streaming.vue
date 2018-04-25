<template>
  <div class="streaming-container">
    <div id="local-container">
      <video id="localVideo"></video>
    </div>
    <carousel id="remote-container" :perPage="2" :navigationEnabled="true" :scrollPerPage="true">
      <slide class="remoteVideo" v-for="video in videos" v-bind:key="video" :id="video">
      </slide>
    </carousel>
  </div>
</template>

<script src="./Streaming.js"></script>

<style>
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
  .VueCarousel-wrapper{
    max-height: 100%;
  }
  .remoteVideo{
    max-height: 100%;
  }
  .remoteVideo video{
    max-height: 100%;
    border-radius: 10px;
  }
</style>
