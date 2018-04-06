<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-4">
        <form @submit.prevent @change="changed($event)">
          <div class="form-group">
            <label for="nameInput">Name</label>
            <input type="text" class="form-control" id="nameInput" required placeholder="Kirill S." v-model="user.name">
          </div>
          <div class="form-group">
            <label for="usernameInput">Username</label>
            <input type="text" class="form-control" id="usernameInput" required placeholder="iSm1le" v-model="user.username">
          </div>
          <div class="form-group">
            <label for="emailInput">Email</label>
            <input type="email" class="form-control" id="emailInput" required placeholder="email@example.com" v-model="user.email">
          </div>
          <div class="form-group">
            <label for="rolesInput">Roles</label>
            <input type="text" class="form-control bg-danger text-white" id="rolesInput" disabled value="Under Development">
          </div>
          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input type="password" class="form-control" id="passwordInput" placeholder="password" v-model="password">
          </div>
          <router-link to="/panel/users" class="btn btn-primary">Go back</router-link>
          <button type="submit" class="btn btn-success" :disabled="!isChanged" @click="edit()">Edit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../auth'

export default {
  data () {
    return {
      user: {},
      userOld: {},
      isChanged: false,
      passwordChanged: false,
      password: ''
    }
  },
  methods: {
    changed (event) {
      if ((!(JSON.stringify(this.user) === this.userOld)) || this.password) {
        this.isChanged = true
      } else {
        this.isChanged = false
      }
    },
    edit () {
      if (this.isChanged) {
        if (this.password) {
          this.user.password = this.password
          this.passwordChanged = true
        }
        this.user.changedBy = this.currentUser.username
        this.$http.put(this.apiEndpoint + '/users/id/' + this.id, this.user, { headers: auth.getAuthHeader() }).then((data, err) => {
          if (!err) {
            if ((this.user._id === this.id) && this.passwordChanged) {
              auth.logout()
              this.$router.push('/')
            } else {
              this.$router.push('/panel/users')
            }
          }
        })
      }
    }
  },
  computed: {
    currentUser () {
      return auth.getUser()
    },
    id () {
      return this.$route.params.id
    }
  },
  created () {
    this.$http.get(this.apiEndpoint + '/users/id/' + this.id, { headers: auth.getAuthHeader() }).then((data, err) => {
      if (!err) {
        this.user = data.body
        this.userOld = JSON.stringify(this.user)
      }
    })
  }
}
</script>
