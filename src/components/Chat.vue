<template>
  <v-container class="chat-container">
    <div id="messages">
      <ol class="conversation">
        <li class="message" v-for="message in messages" v-bind:key="message.message" v-bind:class="{self: message.sender == user.id, other: message.sender != user.id}">
          <div v-if="message.sender != user.id" class="chat-avatar">
            <img src="https://scontent.fbog2-2.fna.fbcdn.net/v/t1.0-9/29257602_2363274117023494_462666611703152640_n.jpg?_nc_cat=0&oh=0eddf2864747e842e64d2de3a9f760df&oe=5B361F5F" />
          </div>
          <div class="message-text" v-html="processText(message.message)">
          </div>
          <div v-if="message.sender == user.id" class="chat-avatar">
            <img src="https://scontent.fbog2-2.fna.fbcdn.net/v/t1.0-9/29257602_2363274117023494_462666611703152640_n.jpg?_nc_cat=0&oh=0eddf2864747e842e64d2de3a9f760df&oe=5B361F5F" />
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
          <v-text-field id="new-message" solo multi-line no-resize label="Write a message" v-model="newMessage" style="position: absolute; width: 70%; left: 15%; bottom: 2vh; border-radius: 20px;"></v-text-field>
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
import { Picker, Emoji } from 'emoji-mart-vue'

export default {
  name: 'Chat',
  data: () => ({
    newMessage: '',
    // eslint-disable-next-line
    emojiConverter: new EmojiConvertor(),
    user: JSON.parse(localStorage.getItem('user')),
    messages: [
      {
        message: 'Mensaje de prueba :heart_eyes:',
        sender: 1
      },
      {
        message: 'Mensaje de prueba 2',
        sender: 4
      },
      {
        message: 'Mensaje de prueba 3',
        sender: 4
      },
      {
        message: 'Mensaje de prueba 4',
        sender: 1
      }
    ]
  }),
  mounted () {
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
  },
  methods: {
    sendMessage () {
      this.messages.push({message: this.newMessage, sender: this.user.id})
      this.newMessage = ''
      console.log(document.getElementById('messages'))
      document.getElementById('messages').scrollTop = 5000
    },
    addEmoji (data) {
      this.newMessage += this.emojiConverter.replace_colons(data.colons)
    },
    processText (message) {
      let output = this.emojiConverter.replace_colons(message)
      return output
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
    height: 75%;
    width: 90%;
    left: 5%;
    bottom: 20%;
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
    position: relative;
  }
  .chat-avatar img {
    width: 100%;
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
