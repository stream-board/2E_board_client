<template>
<v-container>
   <v-navigation-drawer
      fixed
      app
      clipped
      id="drawer"
    >
    <v-container>
      <v-layout row wrap text-xs-center>
        <v-flex xs12>
          <v-avatar
            size="64"
            class="grey lighten-4"
          >
            <img :src="user.image" alt="avatar">
          </v-avatar>
        </v-flex>
        <v-flex xs12 class="mt-3">
          <h1 class="headline">{{user.name}}</h1>
        </v-flex>
        <v-flex xs12 class="mt-1 grey--text">
          <h1 class="subheading">{{user.nickname}}</h1>
        </v-flex>
        <v-flex xs12 class="grey--text">
          <h1 class="subheading">{{user.email}}</h1>
        </v-flex>
      </v-layout>
    </v-container>
    <v-list dense id="categories">
      <v-divider></v-divider>
      <v-list-tile :value="'all' === selectedCategory" @click="sortBy('all')">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>All</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <template v-for="category in orderedCategories">
        <v-list-tile :value="category.value === selectedCategory" :key="category.value" @click="sortBy(category.value)">
          <v-list-tile-action>
            <v-icon>{{category.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{category.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="accent" dark fixed app clipped-left>
    <v-toolbar-title>
      <img src="@/assets/images/logo-white.png" id="logo">
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="logout()">
      <v-icon>exit_to_app</v-icon>
    </v-btn>
  </v-toolbar>
  <v-content id="content-container" style="padding-left: 0; padding-top: 0">
    <v-container fluid fill-height>
      <v-layout justify-center row wrap>
        <v-flex xs12 text-xs-center>
          <h1 class="display-3">Welcome to StreamBoard</h1>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <v-dialog v-model="joinDialog" persistent max-width="500px">
            <v-btn color="primary" slot="activator">JOIN A ROOM</v-btn>
            <v-card>
              <v-card-title class="headline">Join a Room</v-card-title>
              <v-card-text>
                <v-text-field
                  autofocus
                  label="Room Id"
                  mask="#######################"
                  v-model="joinId"
                  @keyup.enter="joinRoom(joinId)"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" flat @click.native="cancelJoin()">Cancel</v-btn>
                <v-btn color="primary" @click.native="joinRoom(joinId)">Join</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="createDialog" persistent max-width="500px">
            <v-btn color="primary" slot="activator">CREATE A ROOM</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Create a Room</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field autofocus label="Name" required v-model="newRoom.name" @keyup.enter="createRoom()"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Description" multi-line v-model="newRoom.description" @keyup.enter="createRoom()"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select
                        label="Category"
                        required
                        :items="categories"
                        item-text="name"
                        v-model="newRoom.category"
                      >
                        <template slot="item" slot-scope="data">
                          <v-list-tile-avatar>
                            <v-icon>{{data.item.icon}}</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" flat @click.native="cancelCreate()">Cancel</v-btn>
                <v-btn color="primary" @click.native="createRoom()">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="primary" @click="refresh()">REFRESH</v-btn>
        </v-flex>
        <v-list class="list mt-5" two-line>
          <v-flex xs12>
            <v-list-tile class="room" avatar v-for="room in allRooms" :key="room.idRoom">
              <v-list-tile-action>
                <v-icon>{{room.category.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-avatar>
                <img :src="room.owner.image">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{room.nameRoom}}</v-list-tile-title>
                <v-list-tile-sub-title ><span class="bold">{{room.owner.name}}</span> - {{room.descriptionRoom}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-btn color="primary" @click="joinRoom(room.idRoom)">JOIN</v-btn>
            </v-list-tile>
          </v-flex>
        </v-list>
      </v-layout>
    </v-container>
  </v-content>
  <v-snackbar
    color="error"
    v-model="snackbar"
    >
    {{ message }}
    <v-btn dark flat @click.native="snackbar = false"><v-icon>close</v-icon></v-btn>
  </v-snackbar>
</v-container>
</template>

<script>
import { CREATE_ROOM_MUTATION, JOIN_ROOM_MUTATION, ALL_ROOMS_QUERY, DELETE_SESSION_MUTATION, ROOM_ADDED_SUBSCRIPTION, ROOM_DELETED_SUBSCRIPTION } from '../constants/graphql'
import { CATEGORIES } from '../constants/constants'

export default {
  name: 'Lobby',
  apollo: {
    allRooms: {
      query: ALL_ROOMS_QUERY,
      fetchPolicy: 'network-only',
      subscribeToMore: [
        {
          document: ROOM_ADDED_SUBSCRIPTION,
          updateQuery: (previousResult, { subscriptionData }) => {
            let newList = previousResult.allRooms.slice(0)
            newList.push(subscriptionData.data.roomAdded)
            let result = {allRooms: newList}
            return result
          }
        },
        {
          document: ROOM_DELETED_SUBSCRIPTION,
          updateQuery: (previousResult, { subscriptionData }) => {
            let newList = previousResult.allRooms.slice(0)
            let resultList = newList.filter((item) => {
              console.log(item)
              console.log(subscriptionData.data)
              return item.idRoom !== subscriptionData.data.roomDeleted.idRoom
            })
            let result = {allRooms: resultList}
            return result
          }
        }
      ],
      update (data) {
        let rooms = []
        data.allRooms.forEach((item) => {
          let newCategory = this.categories.filter((category) => {
            return category.value === item.categoryRoom
          })[0]
          if (!newCategory) {
            newCategory = this.categories[0]
          }
          let room = {
            idRoom: item.idRoom,
            owner: item.owner,
            nameRoom: item.nameRoom,
            descriptionRoom: item.descriptionRoom,
            category: newCategory
          }
          rooms.push(room)
        })
        return rooms
      }
    }
  },
  data () {
    return {
      createDialog: false,
      joinDialog: false,
      snackbar: false,
      message: 'Error while creating room',
      roomsList: [],
      user: JSON.parse(localStorage.getItem('user')),
      selectedCategory: 'all',
      newRoom: {},
      joinId: null,
      categories: CATEGORIES,
      allRooms: []
    }
  },
  methods: {
    joinRoom (id) {
      let user = JSON.parse(localStorage.getItem('user'))
      this.$apollo.mutate({
        mutation: JOIN_ROOM_MUTATION,
        variables: {
          idOwner: user.id,
          idRoom: id
        }
      }).then((response) => {
        this.$router.push({path: `/app/${id}`})
      }).catch((error) => {
        console.log(error)
        this.message = `Room doesn't exist`
        this.snackbar = true
      })
    },
    createRoom () {
      let user = JSON.parse(localStorage.getItem('user'))
      this.$apollo.mutate({
        mutation: CREATE_ROOM_MUTATION,
        variables: {
          idOwner: user.id,
          nameRoom: this.newRoom.name,
          descriptionRoom: this.newRoom.description,
          categoryRoom: this.newRoom.category
        }
      }).then((response) => {
        let id = response.data.createRoom.idRoom
        this.$router.push({path: `/app/${id}`})
      }).catch((error) => {
        console.log(error)
        this.message = 'Error creating room'
        this.snackbar = true
      })
    },
    cancelCreate () {
      this.newRoom = {}
      this.createDialog = false
    },
    cancelJoin () {
      this.joinId = null
      this.joinDialog = false
    },
    sortBy (category) {
      this.selectedCategory = category
    },
    checkCategory (category) {
      if (this.selectedCategory === 'all') {
        return true
      } else if (this.selectedCategory === category) {
        return true
      }
      return false
    },
    logout () {
      let user = JSON.parse(localStorage.getItem('user'))
      this.$apollo.mutate({
        mutation: DELETE_SESSION_MUTATION,
        variables: {
          uid: user.email,
          token: user.token,
          client: user.client
        }
      }).then((response) => {
        localStorage.setItem('user', '')
        this.$router.push({path: `/login`})
      }).catch((error) => {
        console.log(error)
        this.message = 'Error logging out'
        this.snackbar = true
      })
    }
  },
  computed: {
    orderedCategories () {
      let ordered = this.categories
      return ordered.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#logo{
  height: 6vh;
  width: auto;
}
.active{
  background-color: #e0e0e0;
  color: #26d3cd;
}
.list{
  width: 100%;
}
.room{
  width: 100%;
}
.bold{
  font-weight: bold;
}
</style>
