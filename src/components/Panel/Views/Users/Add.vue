<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-4">
        <form @submit.prevent>
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
            <input type="password" class="form-control" id="passwordInput" required placeholder="password" v-model="user.password">
          </div>
          <router-link to="/panel/users" class="btn btn-primary">Go back</router-link>
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
        username: '',
        email: '',
        roles: [],
        password: ''
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
