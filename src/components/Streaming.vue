<template>
  <div class="streaming-container">
    <div id="master-videos">
    </div>
    <div id="client-videos-container">
      <carousel navigationEnabled id="client-videos" :per-page="3" mouse-drag="false">
      </carousel>
    </div>
  </div>
</template>

<script src="./Streaming.js"></script>

<style>
  .streaming-container{
    background-color: #174557;
  }
  #master-videos{
    width: 100%;
    height: 70%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  #client-videos-container{
    width: 100%;
    height: 30%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #local_video{
    border-radius: 10px;
    max-height: 95%;
  }
  .remote-video{
    margin: 1%;
    border-radius: 5px;
    max-width: 28%;
  }
</style>
