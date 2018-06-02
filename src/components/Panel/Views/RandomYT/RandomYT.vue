<template>
  <div class="page-container">
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Random YT videos</h1>
        <md-button
          class="md-icon-button md-raised md-primary"
          to="/panel/ryt/add">
          <md-icon>add</md-icon>
        </md-button>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Video ID</md-table-head>
        <md-table-head>Views/Start/End</md-table-head>
        <md-table-head>Likes/Dislikes/Reports</md-table-head>
        <md-table-head>Changed by</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="(video, index) in ytVideos"
        :key="index">
        <md-table-cell>{{ (index + 1) + ((Page - 1) * limit) }}</md-table-cell>
        <md-table-cell :title="video.friendlyName">{{ (video.friendlyName == null ? 'NONE' : video.friendlyName) }}</md-table-cell>
        <md-table-cell>{{ video.videoId }}</md-table-cell>
        <md-table-cell>{{ `${video.views}/${video.start === null || 0 ? 0 : video.start}/${video.end === null || 0 ? 0 : video.end}` }}</md-table-cell>
        <md-table-cell>{{ `${video.likes === null || 0 ? 0 : video.likes}/${video.dislikes === null || 0 ? 0 : video.dislikes}/${video.reports === null || 0 ? 0 : video.reports}` }}</md-table-cell>
        <md-table-cell :title="video.updated">{{ video.changedBy == null ? 'UFO' : video.changedBy }}</md-table-cell>
        <md-table-cell>
          <md-button
            title="Play video"
            :href="`https://yrv.xaff.ru/${video.videoId}?start=${video.start}&end=${video.end}`"
            target="_blank"
            class="md-icon-button md-accent">
            <md-icon>play_arrow</md-icon>
          </md-button>
          <md-button
            v-if="video.disabled"
            title="Enable"
            class="md-icon-button md-primary"
            @click="toggleShow(video, index)">
            <md-icon>sync_disabled</md-icon>
          </md-button>
          <md-button
            v-else
            title="Disable"
            class="md-icon-button md-primary"
            @click="toggleShow(video, index)">
            <md-icon>sync</md-icon>
          </md-button>
          <md-button
            title="Edit"
            :to="`ryt/edit/${video._id}`"
            class="md-icon-button md-primary">
            <md-icon>mode_edit</md-icon>
          </md-button>
          <md-button
            title="Remove"
            class="md-icon-button md-accent"
            @click="vDelete(index, video._id)">
            <md-icon>delete</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div
      v-if="pagination"
      @click="changePage()">
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page - 1)}`"
        v-if="Page > 1">Previous</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page - 3)}`"
        v-if="(Page - 3) >= 1">{{ Page - 3 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page - 2)}`"
        v-if="(Page - 2) >= 1">{{ Page - 2 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page - 1)}`"
        v-if="(Page - 1) >= 1">{{ Page - 1 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page + 1)}`"
        v-if="(Page + 1) <= Pages">{{ Page + 1 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page + 2)}`"
        v-if="(Page + 2) <= Pages">{{ Page + 2 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page + 3)}`"
        v-if="(Page + 3) <= Pages">{{ Page + 3 }}</md-button>
      <md-button
        class="md-primary"
        :to="`ryt?page=${(Page + 1)}`"
        v-if="(Page + 1) <= Pages">Next</md-button>
    </div>
  </div>
</template>

<script>
import auth from '../../../../auth';

export default {
  data() {
    return {
      ytVideos: null,
      limit: 15,
      Pages: 0,
      pagination: false,
      currentUser: ''
    };
  },
  methods: {
    async changePage() {
      await this.getVideos();
    },
    async vDelete(i, id) {
      try {
        const response = await this.$http.delete(`${this.apiEndpoint}/yrvs/id/${id}`, { headers: await auth.getAuthHeader() });
        if (response.status === 200) {
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': `Video ${id} deleted successfully`,
            'reverse': true
          });
          this.ytVideos.splice(i, 1);
          if (this.ytVideos.length <= 0) {
            if (this.Page > 1) {
              this.$router.push(`/panel/ryt?page=${this.Page - 1}`);
              this.changePage();
            }
          }
        }
      } catch (e) {
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'RandomYT',
          'text': 'Can`t delete video',
          'reverse': true
        });
      }
    },
    async toggleShow(video, index) {
      try {
        video.disabled = !video.disabled;
        video.changedBy = this.currentUser.username;
        const response = await this.$http.put(`${this.apiEndpoint}/yrvs/id/${video._id}`, video, { headers: await auth.getAuthHeader() });
        console.log(response.body);
        if (response.status === 200) {
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': `Video ${video.videoId} was ${video.disabled ? 'disabled' : 'enabled'}`,
            'reverse': true
          });
          this.ytVideos[index].disabled = video.disabled;
        }
      } catch (e) {
        console.log(e);
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'RandomYT',
          'text': 'Undefined error. Your video wasnt disabled',
          'reverse': true
        });
        return false;
      }
    },
    async getVideos() {
      try {
        const videos = await this.$http.get(`${this.apiEndpoint}/yrvs?limit=${this.limit}&page=${this.Page}`);
        this.ytVideos = videos.body;
      } catch (e) {
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'RandomYT',
          'text': 'Undefined error',
          'reverse': true
        });
      }
    }
  },
  computed: {
    Page() {
      return Number(this.$route.query.page || 1);
    }
  },
  async created() {
    try {
      this.currentUser = await auth.getUser();
      const response = await this.$http.get(`${this.apiEndpoint}/yrvs/count`);
      if (response.body >= this.limit) {
        this.pagination = true;
        this.Pages = Math.floor(Number(response.body - 1) / this.limit) + 1;
      }
    } catch (e) {
      this.$notify({
        'group': 'responses',
        'type': 'error',
        'animation-type': 'velocity',
        'title': 'RandomYT',
        'text': 'Undefined error',
        'reverse': true
      });
      if (this.Page - 1 > this.Pages) {
        this.$router.push('/panel/ryt');
      }
    }
    await this.getVideos();
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .md-table-cell-container .md-button:nth-child(1) {
    margin-left: 0;
  }
}
</style>
