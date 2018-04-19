<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-sm-4">
        <form @submit.prevent>
          <div class="form-group">
            <label for="videoNameInput">Video Name</label>
            <input
              type="text"
              class="form-control"
              id="videoNameInput"
              required
              placeholder="My video #1"
              v-model="video.friendlyName">
          </div>
          <div class="form-group">
            <label for="videoIDInput">Video ID</label>
            <input
              type="text"
              class="form-control"
              id="videoIDInput"
              maxlength="11"
              required
              placeholder="SnvMq11gw00"
              v-model="video.videoId">
          </div>
          <div class="form-group">
            <label for="videoStartInput">Video start</label>
            <input
              type="number"
              class="form-control"
              id="videoStartInput"
              min="0"
              placeholder="0"
              v-model="video.start">
          </div>
          <div class="form-group">
            <label for="videoEndInput">Video end</label>
            <input
              type="number"
              class="form-control"
              id="videoEndInput"
              min="0"
              placeholder="0"
              v-model="video.end">
          </div>
          <div class="form-group">
            <label for="videoLikesInput">Likes</label>
            <input
              type="number"
              class="form-control"
              id="videoLikesInput"
              min="0"
              placeholder="0"
              v-model="video.likes">
          </div>
          <div class="form-group">
            <label for="videoDislikesInput">Dislikes</label>
            <input
              type="number"
              class="form-control"
              id="videoDislikesInput"
              min="0"
              placeholder="0"
              v-model="video.dislikes">
          </div>
          <div class="form-group">
            <label for="videoReportsInput">Reports</label>
            <input
              type="number"
              class="form-control"
              id="videoReportsInput"
              min="0"
              placeholder="0"
              v-model="video.reports">
          </div>
          <router-link
            to="/panel/ryt"
            class="btn btn-primary">Go back</router-link>
          <button
            type="submit"
            class="btn btn-success"
            @click="add()">Add</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../../../auth';

export default {
  data() {
    return {
      video: {
        cheangedBy: null,
        currentUser: ''
      }
    };
  },
  methods: {
    async add() {
      this.video.changedBy = this.currentUser.username;
      try {
        const response = await this.$http.post(`${this.apiEndpoint}/yrvs`, this.video, { headers: await auth.getAuthHeader() });
        if (response.status === 200) {
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Video successfully added',
            'reverse': true
          });
          this.$router.push('/panel/ryt');
        }
      } catch (e) {
        console.log(e);
        switch (e.status) {
        case 400:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Error when adding a video',
            'reverse': true
          });
          break;
        case 401:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': `Video with id \`${this.video.videoId}\` already existing`,
            'reverse': true
          });
          break;
        default:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Undefined error',
            'reverse': true
          });
          break;
        }
      }
    }
  },
  async created() {
    this.currentUser = await auth.getUser();
  }
};
</script>
