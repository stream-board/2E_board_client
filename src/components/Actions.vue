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
      <div class="divider-actions"></div>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="askForBoard()">
            <v-icon>create</v-icon>
          </v-btn>
          <span>Ask for board</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1>
        <v-menu offset-y nudge-left="120" nudge-top="15" top>
          <v-tooltip top slot="activator">
            <v-btn small class="elevation-10" slot="activator" dark fab v-bind:style="{ backgroundColor: selectedColor}">
              <v-icon>palette</v-icon>
            </v-btn>
            <span>Change color</span>
          </v-tooltip>
          <v-container id="color-container" grid-list-sm>
            <v-layout row wrap>
              <v-flex xs3 v-for="color in colors" :key="color.value">
                <v-tooltip top>
                  <v-btn slot="activator" fab dark small v-bind:style="{ backgroundColor: color.value}" @click="changeColor(color.value)"></v-btn>
                  <span>{{color.name}}</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-container>
        </v-menu>
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
        <v-menu offset-y top nudge-left="50" nudge-top="15">
          <v-tooltip top slot="activator">
            <v-btn small class="elevation-10" slot="activator" outline fab color="primary" @click="changeThickness()">
              <v-icon v-bind:style="{fontSize: selectedThickness}">lens</v-icon>
            </v-btn>
            <span>Change thickness</span>
          </v-tooltip>
          <v-container id="thickness-container" grid-list-sm>
            <v-layout row wrap>
              <v-flex xs6 v-for="option in thicknesses" :key="option.value">
                <v-btn fab dark color="black" v-bind:style="{width: option.name, height: option.name}" @click="changeThickness(option)"></v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-menu>
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
    cam: true,
    selectedColor: '#f44336',
    selectedThickness: '8px',
    colors: [
      {
        name: 'Red',
        value: '#f44336'
      },
      {
        name: 'Pink',
        value: '#e91e63'
      },
      {
        name: 'Purple',
        value: '#9c27b0'
      },
      {
        name: 'Deep Purple',
        value: '#673ab7'
      },
      {
        name: 'Indigo',
        value: '#3f51b5'
      },
      {
        name: 'Blue',
        value: '#2196f3'
      },
      {
        name: 'Cyan',
        value: '#00bcd4'
      },
      {
        name: 'Teal',
        value: '#009688'
      },
      {
        name: 'Green',
        value: '#4caf50'
      },
      {
        name: 'Lime',
        value: '#cddc39'
      },
      {
        name: 'Yellow',
        value: '#ffeb3b'
      },
      {
        name: 'Orange',
        value: '#ff9800'
      },
      {
        name: 'Brown',
        value: '#795548'
      },
      {
        name: 'Grey',
        value: '#9e9e9e'
      },
      {
        name: 'Blue Grey',
        value: '#607d8b'
      },
      {
        name: 'Black',
        value: '#000000'
      }
    ],
    thicknesses: [
      {
        name: '8px',
        value: 8
      },
      {
        name: '12px',
        value: 12
      },
      {
        name: '16px',
        value: 16
      },
      {
        name: '20px',
        value: 20
      },
      {
        name: '24px',
        value: 24
      },
      {
        name: '28px',
        value: 28
      },
      {
        name: '32px',
        value: 32
      },
      {
        name: '36px',
        value: 36
      }
    ]
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
      this.$bus.emit('ask-for-mic')
    },
    muteMic () {
      this.mic = false
      this.$bus.emit('mute-mic')
    },
    unmuteMic () {
      this.mic = true
      this.$bus.emit('unmute-mic')
    },
    useCam () {
      this.cam = true
      this.$bus.emit('activate-cam')
    },
    blockCam () {
      this.cam = false
      this.$bus.emit('block-cam')
    },
    askForBoard () {
      this.$bus.emit('ask-for-turn')
    },
    changeColor (color) {
      this.$bus.emit('change-color', color)
      this.selectedColor = color
    },
    changeType () {
      console.log('Change type')
    },
    changeThickness (thickness) {
      this.$bus.emit('change-thickness', thickness)
      this.selectedThickness = thickness.name
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
  #color-container{
    width: 20vw;
    background-color: #FFF;
  }
  #thickness-container{
    width: 10vw;
    background-color: #FFF;
  }
</style>
