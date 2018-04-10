<template>
  <v-container class="chat-container">
    <div id="messages">
      <ol class="conversation">
        <li class="message" v-for="(message,index) in messages" v-bind:key="index" v-bind:class="{self: message.user_id == user.id, other: message.user_id != user.id}">
          <div v-if="message.user_id != user.id" class="chat-avatar">
            <img :src="message.image"/>
          </div>
          <div class="message-text" style="word-wrap: break-word; max-width: 90%; text-align: left">
            {{message.message}}
          </div>
          <div v-if="message.user_id == user.id" class="chat-avatar">
            <img :src="message.image"/>
          </div>
        </li>
      </ol>
    </div>
    <v-container id="input-container">
      <v-layout row>
        <v-flex xs1>
          <v-menu offset-y top :close-on-content-click="false">
            <v-btn slot="activator" flat icon color="white" style="margin: 0; z-index: 4">
              <v-icon>mdi-emoticon-happy</v-icon>
            </v-btn>
            <v-container style="background-color: #FFF">
              <picker @click="(emoji, event) => addEmoji(emoji)"/>
            </v-container>
          </v-menu>
        </v-flex>
        <div id="new-message-container" style="position: absolute; width: 100%; height: 10vh; bottom: 0; left: 0; background-color: #174557;">
          <v-text-field id="new-message" autofocus solo multi-line no-resize label="Write a message" v-model="newMessage" style="position: absolute; width: 70%; left: 15%; bottom: 2vh; border-radius: 20px;" @keyup.enter="sendMessage()"></v-text-field>
        </div>
        <v-flex xs1 offset-xs10>
          <v-btn flat icon color="white" style="margin: 0; z-index: 4" @click="sendMessage()">
            <v-icon>send</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { MESSAGES_BY_ROOM_ID_QUERY, USER_IMAGE_BY_ID_QUERY } from '../constants/graphql'
import { Picker, Emoji } from 'emoji-mart-vue'

export default {
  name: 'Chat',
  data: () => ({
    newMessage: '',
    // eslint-disable-next-line
    emojiConverter: new EmojiConvertor(),
    user: JSON.parse(localStorage.getItem('user')),
    messages: [],
    socket: null,
    roomId: 0
  }),
  props: [
    'room',
    'participants'
  ],
  mounted () {
    this.roomId = this.$route.params.roomid
    console.log(this.roomId)
    let messageInput = document.getElementById('new-message')
    let inputContainer = document.getElementById('new-message-container')
    messageInput.style.height = 0
    messageInput.style.height = messageInput.scrollHeight + 'px'
    messageInput.addEventListener('keyup', function () {
      this.style.height = 0
      this.style.height = this.scrollHeight + 'px'
      let newHeight = this.scrollHeight + 45
      inputContainer.style.height = newHeight + 'px'
    }, false)
    this.emojiConverter.init_env()
    this.emojiConverter.replace_mode = 'unified'
    this.emojiConverter.allow_native = true
    this.$apollo.query({
      query: MESSAGES_BY_ROOM_ID_QUERY,
      variables: {
        id: this.roomId
      }
    }).then((result) => {
      let data = result.data.chatMsgByRoomId.slice()
      let promises = []
      let newMessages = []
      data.forEach((message) => {
        promises.push(
          this.$apollo.query({
            query: USER_IMAGE_BY_ID_QUERY,
            variables: {
              id: message.user_id
            }
          }).then((result) => {
            return result.data.userById.data.image
          }).catch((error) => {
            console.log(error)
          })
        )
      })
      Promise.all(promises).then((values) => {
        for (let i = 0; i < values.length; i++) {
          newMessages.push({
            message: data[i].message,
            user_id: data[i].user_id,
            image: values[i]
          })
        }
        this.messages = newMessages
      })
    }).catch((error) => {
      console.log(error)
    })
    this.initializeSockets()
  },
  methods: {
    sendMessage () {
      this.socket.send(JSON.stringify({
        'category': 'NEW-MESSAGE',
        'room_id': this.roomId,
        'sender': 'Felipe',
        'user_id': this.user.id,
        'message': this.newMessage
      }))
      this.newMessage = ''
      window.setTimeout(() => {
        $('#new-message-container').height('10vh')
        $('#new-message').height('27px')
      }, 1)
    },
    addEmoji (data) {
      this.newMessage += this.emojiConverter.replace_colons(data.colons)
    },
    initializeSockets () {
      let URL = `ws://ec2-54-224-164-98.compute-1.amazonaws.com:4004/chat-room/${this.$route.params.roomid}`
      // eslint-disable-next-line
      this.socket = new ReconnectingWebSocket(URL)

      this.socket.onopen = () => {
        console.log('Connected to chat socket')
        this.socket.send(JSON.stringify({
          'category': 'JOIN-ROOM',
          'room_id': this.roomId,
          'user_id': this.user.nickname
        }))
      }

      this.socket.onclose = () => {
        console.log('Disconnected from the chat socket')
      }

      this.socket.onmessage = (msg) => {
        let data = JSON.parse(msg.data)
        if (data['category'] !== 'JOIN-ROOM') {
          this.$apollo.query({
            query: USER_IMAGE_BY_ID_QUERY,
            variables: {
              id: data.user_id
            }
          }).then((result) => {
            this.messages.push({
              message: data.message,
              user_id: data.user_id,
              image: result.data.userById.data.image
            })
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.$bus.emit('new-participant', data)
        }
      }
    }
  },
  watch: {
    'messages': function () {
      window.setTimeout(() => {
        $('#messages').scrollTop($('#messages')[0].scrollHeight + 200)
      }, 50)
    }
  },
  components: {
    'picker': Picker,
    'emoji': Emoji
  }
}
</script>

<style scoped>
  .chat-container{
    background-color: #174557;
  }
  #input-container{
    position: absolute;
    height: 10vh;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  #messages{
    background-color: #FFF;
    position: absolute;
    height: 67%;
    width: 90%;
    left: 5%;
    bottom: 27%;
    border-radius: 20px;
    overflow-y: scroll;
  }
  .message{
    padding: 5px 10px;
  }
  .message-text p {
    margin: 0;
  }
  .conversation li {
    display: flex;
  }
  .chat-avatar {
    width: 40px;
    height: 40px;
    position: relative;
  }
  .chat-avatar img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
  }
  .self {
    /* switch horizontal layout */
    justify-content: flex-end;
    justify-items: flex-end;
    /* switch vertical layout */
    align-items: flex-end;
  }
  .self .message-text{
    background-color: #174557;
    color: #FFFFFF;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 15px 20px;
  }
  .other .message-text{
    background-color: #E0E0E0;
    color: #000000;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    padding: 15px 20px;
  }
  .other .chat-avatar::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border: 5px solid #E0E0E0;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }
  .self .chat-avatar::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border: 5px solid #174557;
    border-right-color: transparent;
    border-top-color: transparent;
  }
</style>
