<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-auto">
        <form @submit.prevent>
          <div class="form-group">
            <label for="nameInput">Name</label>
            <input type="text" id="nameInput" placeholder="Name" required v-model="user.name">
          </div>
          <div class="form-group">
            <label for="userNameInput">username</label>
            <input type="text" id="userNameInput" placeholder="username" required v-model="user.username">
          </div>
          <div class="form-group">
            <label for="emailInput">Email</label>
            <input type="email" id="emailInput" placeholder="test@example.com" required v-model="user.email">
          </div>
          <div class="form-group">
            <label for="rolesInput">Roles</label>
            <input type="text" id="rolesInput" placeholder="null">
          </div>
          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input type="password" id="passwordInput" placeholder="Password" required v-model="user.password">
          </div>
          <router-link to="/panel/users" class="btn btn-warning">Go back</router-link>
          <button type="submit" class="btn btn-success" @click="add()">Add</button>
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
      user: {
        name: 'Alex T.',
        username: null,
        email: null,
        roles: [],
        password: null
      }
    }
  },
  methods: {
    add () {
      this.user.changedBy = this.currentUser.username
      this.$http.post(this.apiEndpoint + '/users', this.user, { headers: auth.getAuthHeader() }).then((data, err) => {
        if (!err) {
          this.$router.push('/panel/users')
        }
      })
    }
  },
  computed: {
    currentUser () {
      return auth.getUser()
    }
  }
}
</script>
