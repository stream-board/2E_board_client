import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Room from '@/components/Room'
import Streaming from '@/components/Streaming.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:roomid',
      name: 'Room',
      component: Room
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/',
      name: 'Streaming',
      component: Streaming
    }
  ]
})
