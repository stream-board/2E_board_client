// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, concat, split } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import VueBus from 'vue-bus'
import VueCarousel from 'vue-carousel'

import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

Vue.use(VueBus)

const httpLink = new HttpLink({
  uri: 'http://35.190.138.158/graphql'
})

const authMiddleware = new ApolloLink((operation, forward) => {
  let user = JSON.parse(localStorage.getItem('user'))
  console.log(user)
  operation.setContext({
    headers: {
      'access-token': user.token || null,
      client: user.client || null,
      uid: user.email || null
    }
  })

  return forward(operation)
})

const wsLink = new WebSocketLink({
  uri: 'ws://35.190.138.158/subscriptions',
  options: {
    reconnect: true
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  concat(authMiddleware, httpLink)
)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

Vue.use(VueSweetalert2)

Vue.use(Vuetify, {
  theme: {
    primary: '#26d3cd',
    secondary: '#0a8b88',
    accent: '#174557',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  },
  icons: {
    'eraser': 'sb-eraser'
  }
})

Vue.use(VueCarousel)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  provide: apolloProvider.provide(),
  store: store,
  components: {App},
  template: '<App/>'
})
