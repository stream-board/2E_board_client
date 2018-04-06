<template>
  <v-container fluid grid-list-md text-xs-center class="actions-container">
    <v-layout row fill-height align-center>
      <v-flex xs3 justify-start>
        <h1 class="title white--text">{{room.nameRoom}}</h1>
        <span class="body-2 grey--text">Room id: {{room.idRoom}}</span>
      </v-flex>
      <v-spacer></v-spacer>
      <div class="divider-actions"></div>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="askForMic()">
            <v-icon>pan_tool</v-icon>
          </v-btn>
          <span>Ask for mic</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip v-if="mic" top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="muteMic()">
            <v-icon>mic</v-icon>
          </v-btn>
          <span>Mute mic</span>
        </v-tooltip>
        <v-tooltip v-else top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="error" @click="unmuteMic()">
            <v-icon>mic_off</v-icon>
          </v-btn>
          <span>Unmute mic</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip v-if="cam" top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="blockCam()">
            <v-icon>videocam</v-icon>
          </v-btn>
          <span>Show cam</span>
        </v-tooltip>
        <v-tooltip v-else top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="error" @click="useCam()">
            <v-icon>videocam_off</v-icon>
          </v-btn>
          <span>Hide cam</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="askForBoard()">
            <v-icon>create</v-icon>
          </v-btn>
          <span>Ask for board</span>
        </v-tooltip>
      </v-flex>
      <div class="divider-actions"></div>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="changeColor()">
            <v-icon>palette</v-icon>
          </v-btn>
          <span>Change color</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="changeType()">
            <v-icon>brush</v-icon>
          </v-btn>
          <span>Change type</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="changeThickness()">
            <v-icon>lens</v-icon>
          </v-btn>
          <span>Change thickness</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="takeScreenshot()">
            <v-icon>wallpaper</v-icon>
          </v-btn>
          <span>Take screenshot</span>
        </v-tooltip>
      </v-flex>
      <div class="divider-actions"></div>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="error" @click="exitToLobby()">
            <v-icon>call_end</v-icon>
          </v-btn>
          <span>Go to lobby</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Actions',
  data: () => ({
    mic: true,
    cam: true
  }),
  props: [
    'room'
  ],
  methods: {
    exitToLobby () {
      this.$router.push({path: '/app'})
    },
    askForMic () {
      console.log('Asked for mic')
    },
    muteMic () {
      this.mic = false
    },
    unmuteMic () {
      this.mic = true
    },
    useCam () {
      this.cam = true
    },
    blockCam () {
      this.cam = false
    },
    askForBoard () {
      console.log('Asked for board')
    },
    changeColor () {
      console.log('Change color')
    },
    changeType () {
      console.log('Change type')
    },
    changeThickness () {
      console.log('Change thickness')
    },
    takeScreenshot () {
      console.log('Screenshot')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .actions-container{
    background-color: #174557;
  }
  .divider-actions{
    height: 100%;
    width: 0.1%;
    background-color: #1b627c;
  }
</style>
