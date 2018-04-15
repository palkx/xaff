<template>
  <div id="home">
    <div class="container-fluid justify-content-center">
      <div class="row">
        <div class="col-sm-3 hero">
          <div v-if="!showLogin">
            Hello, you visited <b>{{ siteTitle }}</b><br>
            <button class="btn btn-primary" @click="$router.push('panel/ryt')" v-if="authenticated">Go to Panel</button>
            <button class="btn btn-primary" @click="showLogin = !showLogin" v-else>Auth me!</button>
          </div>
          <div v-else>
            <form @submit.prevent @change="changed($event)">
              <div class="form-group">
                <label for="emailInput">Email</label>
                <input type="email" class="form-control" id="emailInput" required placeholder="email@example.com" v-model="credentials.email">
              </div>
              <div class="form-group">
                <label for="passwordInput">Password</label>
                <input type="password" class="form-control" id="passwordInput" required placeholder="password" v-model="credentials.password">
              </div>
              <button class="btn btn-primary" @click="showLogin = !showLogin">X</button>
              <button class="btn btn-success" type="submit" :disabled="!authButton" @click="submit()">Auth!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../auth'

export default {
  data () {
    return {
      siteTitle: 'XaFF',
      credentials: {
        email: '',
        password: ''
      },
      authButton: false,
      showLogin: false,
      authenticated: false
    }
  },
  methods: {
    submit () {
      auth.login(this, this.credentials, 'panel/ryt')
    },
    changed (e) {
      if (this.credentials.email && this.credentials.password) {
        this.authButton = true
      } else {
        this.authButton = false
      }
    }
  },
  async created () {
    this.authenticated = await auth.checkAuth()
  }
}
</script>

<style lang="scss">
  #home {
    width: 100%;
    height: 100%;
    margin: auto;
    background:url(./../../assets/img/cover.jpg) #000 center no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .hero {
    color: white;
    font-size: 24px;
    background: rgba(0,0,0,.7);
    max-width: 30%;
    margin: auto;
    padding: 30px;
  }
</style>
