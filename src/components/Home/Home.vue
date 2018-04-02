<template>
  <div id="home">
    <div class="container-fluid justify-content-center">
      <div class="row">
        <div class="col-sm-12 hero">
          <div v-if="!showLogin">
            Hello, you visited <b>{{ siteTitle }}</b><br>
            <button class="btn btn-primary" @click="$router.push('panel')" v-if="authenticated">Go to Panel</button>
            <button class="btn btn-primary" @click="showLogin = !showLogin" v-else>Auth me!</button>
          </div>
          <div v-else>
            <form @submit.prevent>
              <div class="form-group">
                <label for="emailInput">Email</label>
                <input type="email" id="emailInput" placeholder="email@example.com" required v-model="credentials.email">
              </div>
              <div class="form-group">
                <label for="passwordInput">Password</label>
                <input type="password" id="passwordInput" placeholder="Password" required v-model="credentials.password">
              </div>
              <button class="btn btn-primary" @click="showLogin = !showLogin">X</button>
              <input class="btn btn-success" type="submit" @click="submit()" value="Auth!"/>
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
        email: null,
        password: null
      },
      showLogin: false
    }
  },
  methods: {
    submit () {
      auth.login(this, this.credentials, 'panel')
    }
  },
  computed: {
    authenticated () {
      return auth.checkAuth()
    }
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
    margin: 0 auto;
    padding: 2%;
  }
</style>
