import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Room from '@/components/Room'
import Login from '@/components/Login'
import Application from '@/components/Application'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/app',
      name: 'Application',
      component: Application,
      children: [
        {
          path: ':roomid',
          name: 'Room',
          component: Room
        },
        {
          path: '',
          name: 'Lobby',
          component: Lobby,
          canReuse: false
        }
      ]
    },
    {
      path: '',
      redirect: '/app'
    }
  ]
})
