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
        <v-menu offset-y nudge-left="120" nudge-top="15" top>
          <v-tooltip top slot="activator">
            <v-btn small class="elevation-10" slot="activator" outline fab color="primary">
              <v-icon>mdi-account-multiple</v-icon>
            </v-btn>
            <span>See participants</span>
          </v-tooltip>
          <v-container id="participants-container" grid-list-sm>
            <v-layout row wrap>
              <v-list row>
                <v-list-tile xs2 avatar v-for="participant in participants" :key="participant.id">
                  <v-list-tile-avatar>
                    <img :src="participant.image">
                  </v-list-tile-avatar>
                  <v-list-tile-content xs8>
                    <v-list-tile-title v-text="participant.name"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action xs2 v-if="admin">
                    <v-icon v-if="participant.id === room.owner.id" color="primary">star</v-icon>
                    <v-btn flat icon color="error" v-else @click="banUser(participant.id)">
                      <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-action xs2 v-else>
                    <v-icon v-if="participant.id === room.owner.id" color="primary">star</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-layout>
          </v-container>
        </v-menu>
      </v-flex>
      <div class="divider-actions"></div>
      <v-flex xs1 v-if="admin">
        <v-tooltip top>
          <v-btn small class="elevation-10" :disabled="isAllowed" slot="activator" outline fab color="primary" @click="takeBackPencil()">
            <v-icon>mdi-pencil-lock</v-icon>
          </v-btn>
          <span>Take back pencil</span>
        </v-tooltip>
      </v-flex>
      <v-flex xs1 v-else>
        <v-tooltip top>
          <v-btn small class="elevation-10" :disabled="isAllowed" slot="activator" outline fab color="primary" @click="askForBoard()">
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
        <v-menu offset-y top nudge-left="35" nudge-top="15">
          <v-tooltip top slot="activator">
            <v-btn small class="elevation-10" slot="activator" outline fab color="primary">
              <v-icon>{{selectedType}}</v-icon>
            </v-btn>
            <span>Change type</span>
          </v-tooltip>
          <v-list>
            <v-list-tile v-for="item in types" :key="item.value" @click="changeType(item)">
              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
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
                <v-btn fab dark v-bind:style="{width: option.name, height: option.name, backgroundColor: selectedColor}" @click="changeThickness(option)"></v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-menu>
      </v-flex>
      <v-flex xs1>
        <v-tooltip top>
          <v-btn small :disabled="!isAllowed" class="elevation-10" slot="activator" outline fab color="primary" @click="clearBoard()">
            <v-icon>delete</v-icon>
          </v-btn>
          <span>Clear Board</span>
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
import { COLORS, THICKNESSES, TYPES } from '../constants/constants'
import { PARTICIPANTS_BY_ID_QUERY, PARTICIPANT_JOINED_SUBSCRIPTION, PARTICIPANT_LEFT_SUBSCRIPTION } from '../constants/graphql'

export default {
  name: 'Actions',
  data: () => ({
    mic: true,
    cam: true,
    admin: false,
    isAllowed: false,
    selectedColor: '#f44336',
    selectedThickness: '8px',
    selectedType: 'brush',
    colors: COLORS,
    thicknesses: THICKNESSES,
    types: TYPES,
    user: JSON.parse(localStorage.getItem('user')),
    participants: []
  }),
  props: [
    'room'
  ],
  apollo: {
    participants: {
      query: PARTICIPANTS_BY_ID_QUERY,
      variables () {
        return {
          id: this.$route.params.roomid
        }
      },
      update (data) {
        return data.participantsById
      },
      subscribeToMore: [
        { document: PARTICIPANT_JOINED_SUBSCRIPTION,
          variables () {
            return {
              roomId: this.$route.params.roomid
            }
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            let newList = previousResult.participantsById.slice(0)
            newList.push(subscriptionData.data.participantJoined)
            let result = {participantsById: newList}
            return result
          }
        },
        { document: PARTICIPANT_LEFT_SUBSCRIPTION,
          variables () {
            return {
              roomId: this.$route.params.roomid
            }
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            let newList = previousResult.participantsById.slice(0)
            newList = newList.filter(item => item.id !== subscriptionData.data.participantLeft)
            let result = {participantsById: newList}
            return result
          }
        }
      ],
      fetchPolicy: 'network-only'
    }
  },
  mounted () {
    this.$bus.on('set-admin', () => {
      this.admin = true
    })
    this.$bus.on('change-permissions', (data) => {
      this.isAllowed = data
    })
  },
  methods: {
    exitToLobby () {
      this.$router.push('/app')
    },
    askForMic () {
      this.$bus.emit('ask-for-mic')
    },
    askForBoard () {
      this.$bus.emit('ask-for-turn')
    },
    takeBackPencil () {
      this.$bus.emit('take-back-pencil')
    },
    changeColor (color) {
      this.$bus.emit('change-color', color)
      this.selectedColor = color
    },
    changeType (type) {
      this.selectedType = type.icon
      this.$bus.emit('change-type', type.value)
    },
    changeThickness (thickness) {
      this.$bus.emit('change-thickness', thickness)
      this.selectedThickness = thickness.name
    },
    clearBoard () {
      this.$bus.emit('clear-board')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .actions-container{
    background-color: #174557;
    border-left: 1px solid #1b627c;
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
  #participants-container{
    width: 20vw;
    background-color: #FFF;
  }
</style>
