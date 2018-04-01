<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-auto">
        <form @submit.prevent @change="changed($event)">
          <div class="form-group">
            <label for="nameInput">Video Name</label>
            <input type="text" id="nameInput" placeholder="Input video Name" v-model="video.friendlyName">
          </div>
          <div class="form-group">
            <label for="idInput">Video ID</label>
            <input type="text" id="idInput" placeholder="Input video ID" required v-model="video.videoId">
          </div>
          <div class="form-group">
            <label for="startInput">Video Start</label>
            <input type="number" id="startInput" min="0" placeholder="0" v-model="video.start">
          </div>
          <div class="form-group">
            <label for="endInput">Video End</label>
            <input type="number" id="endInput" min="0" placeholder="null" v-model="video.end">
          </div>
          <div class="form-group">
            <label for="likeInput">Likes count</label>
            <input type="number" id="likeInput" min="0" placeholder="0" v-model="video.likes">
          </div>
          <div class="form-group">
            <label for="dislikeInput">Dislikes count</label>
            <input type="number" id="dislikeInput" min="0" placeholder="0" v-model="video.dislikes">
          </div>
          <div class="form-group">
            <label for="reportInput">Reports count</label>
            <input type="number" id="reportInput" min="0" placeholder="0" v-model="video.reports">
          </div>
          <router-link to="/panel/ryt" class="btn btn-warning">Go back</router-link>
          <button type="submit" class="btn btn-primary" :disabled="!isChanged" @click="edit()">Edit</button>
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
