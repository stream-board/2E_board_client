<template>
  <v-app id="login-page">
    <v-container id="login-card" class="elevation-10">
        <div id="login-form">
            <img src="@/assets/images/logo.png" id="logo">
            <v-container>
                <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field
                label="Enter your email"
                prepend-icon="mail"
                v-model="email"
                :rules="emailRules"
                required
                ></v-text-field>
                <v-text-field
                label="Enter your password"
                hint="At least 8 characters"
                prepend-icon="lock"
                v-model="password"
                :rules="passwordRules"
                :append-icon="hidden ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (hidden = !hidden)"
                :type="hidden ? 'password' : 'text'"
                required
                ></v-text-field>
                <v-btn fab dark id="login-button" @click="submit">
                    <v-icon dark>send</v-icon>
                </v-btn>
            </v-form>
            </v-container>
        </div>
        <div id="login-banner">
            <h1 id="banner-phrase">Join people around the world in interactive video conferences!</h1>
            <img src="@/assets/images/banner.png" alt="" id="banner-image">
        </div>
         <v-snackbar
        color="error"
        v-model="snackbar"
        >
        {{ message }}
        <v-btn dark flat @click.native="snackbar = false"><v-icon>close</v-icon></v-btn>
        </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import { CREATE_SESSION_MUTATION } from '../constants/graphql'

export default {
  name: 'Login',
  data: () => ({
    valid: false,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be at least 8 characters long'
    ],
    hidden: true,
    snackbar: false,
    message: 'Incorrect Credentials'
  }),
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$apollo.mutate({
          mutation: CREATE_SESSION_MUTATION,
          variables: {
            email: this.email,
            password: this.password
          }
        }).then((response) => {
          let user = response.data.createSession
          delete user['__typename']
          localStorage.setItem('user', JSON.stringify(user))
          this.$router.push({path: `/app`})
        }).catch((error) => {
          console.log(error)
          this.snackbar = true
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Patua+One');
#login-page{
    overflow: hidden;
    background-color: #174557;
}
#bg-video{
    height: auto;
    width: 100vw;
    position: absolute;
}
#overlay{
    height: 100vh;
    width: 100vw;
    z-index: 1;
    position: absolute;
    background-color: rgba(0,0,0,0.5);
}
#login-card{
    position: absolute;
    width: 50vw;
    height: 80vh;
    top: 10vh;
    left: 25vw;
    background-color: #FFF;
    z-index: 2;
    border-radius: 10px;
}
#login-form{
    position: absolute;
    width: 50%;
    height: 100%;
    left: 0;
    top: 0;
}
#login-banner{
    position: absolute;
    width: 50%;
    height: 100%;
    right: 0;
    top: 0;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #0a8b88;
}
#login-button{
    position: absolute;
    right: -10%;
    top: 80%;
    background-color: #26d3cd;
    z-index: 3;
}
#logo{
    position: relative;
    top: 20%;
    margin-bottom: 30%;
    max-width: 95%;
    min-width: 95%;
    left: 2.5%;
}
#banner-phrase{
    position: absolute;
    width: 90%;
    top: 5%;
    left: 5%;
    font-family: 'Patua One', cursive;
    color: #FFF;
}
#banner-image{
    position: absolute;
    max-width: 90%;
    bottom: 5%;
    left: 5%;
}
</style>
