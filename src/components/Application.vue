<template>
  <v-app id="inspire">
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { VALIDATE_TOKEN_QUERY } from '../constants/graphql'

export default {
  name: 'Application',
  data: () => ({
    drawer: false
  }),
  props: {
    source: String
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let userString = localStorage.getItem('user')
      if (userString !== '') {
        let user = JSON.parse(userString)
        console.log(user)
        vm.$apollo.query({
          query: VALIDATE_TOKEN_QUERY,
          variables: {
            client: user.client,
            token: user.token,
            uid: user.email
          }
        }).then((result) => {
          let newData = result.data.validateSession
          if (newData.token !== '') {
            user['token'] = newData.token
            user['client'] = newData.client
            localStorage.setItem('user', JSON.stringify(user))
          }
        }).catch((error) => {
          console.log(error)
          vm.$router.push({path: `/login`})
        })
      } else {
        vm.$router.push({path: `/login`})
      }
    })
  }
}
</script>

<style>

</style>
