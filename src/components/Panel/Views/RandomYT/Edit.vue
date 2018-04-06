<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-4">
        <form @submit.prevent @change="changed($event)">
          <div class="form-group">
            <label for="videoNameInput">Video Name</label>
            <input type="text" class="form-control" id="videoNameInput" required placeholder="My video #1" v-model="video.friendlyName">
          </div>
          <div class="form-group">
            <label for="videoIDInput">Video ID</label>
            <input type="text" class="form-control" id="videoIDInput" maxlength="11" required placeholder="SnvMq11gw00" v-model="video.videoId">
          </div>
          <div class="form-group">
            <label for="videoStartInput">Video start</label>
            <input type="number" class="form-control" id="videoStartInput" min="0" placeholder="0" v-model="video.start">
          </div>
          <div class="form-group">
            <label for="videoEndInput">Video end</label>
            <input type="number" class="form-control" id="videoEndInput" min="0" placeholder="0" v-model="video.end">
          </div>
          <div class="form-group">
            <label for="videoLikesInput">Likes</label>
            <input type="number" class="form-control" id="videoLikesInput" min="0" placeholder="0" v-model="video.likes">
          </div>
          <div class="form-group">
            <label for="videoDislikesInput">Dislikes</label>
            <input type="number" class="form-control" id="videoDislikesInput" min="0" placeholder="0" v-model="video.dislikes">
          </div>
          <div class="form-group">
            <label for="videoReportsInput">Reports</label>
            <input type="number" class="form-control" id="videoReportsInput" min="0" placeholder="0" v-model="video.reports">
          </div>
          <router-link to="/panel/ryt" class="btn btn-primary">Go back</router-link>
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
      video: {},
      videoOld: {},
      isChanged: false
    }
  },
  methods: {
    changed (event) {
      if (!(JSON.stringify(this.video) === this.videoOld)) {
        this.isChanged = true
      } else {
        this.isChanged = false
      }
    },
    edit () {
      if (this.isChanged) {
        this.video.changedBy = this.currentUser.username
        this.$http.put(this.apiEndpoint + '/yrvs/id/' + this.id, this.video, { headers: auth.getAuthHeader() }).then((data, err) => {
          if (!err) {
            this.$router.push('/panel/ryt')
          }
        })
      }
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    },
    currentUser () {
      return auth.getUser()
    }
  },
  created () {
    this.$http.get(this.apiEndpoint + '/yrvs/id/' + this.id, { headers: auth.getAuthHeader() }).then((data, err) => {
      if (!err) {
        this.video = data.body
        this.videoOld = JSON.stringify(this.video)
      }
    })
  }
}
</script>
