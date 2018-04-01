<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-auto">
        <form @submit.prevent>
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
      video: {
        cheangedBy: null
      }
    }
  },
  methods: {
    add () {
      this.video.changedBy = this.currentUser.username
      this.$http.post(this.apiEndpoint + '/yrvs', this.video, { headers: auth.getAuthHeader() }).then((data, err) => {
        if (!err) {
          this.$router.push('/panel/ryt')
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
