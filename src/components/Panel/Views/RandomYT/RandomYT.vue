<template>
  <div
    id="ryv"
    class="container-fluid">
    <div class="row">
      <div class="col-sm-11">
        <section class="content-header pull-left">
          <h1>Random youtube video</h1>
        </section>
      </div>
      <div class="col-sm-1">
        <router-link
          :to="'ryt/add'"
          class="btn btn-success">Add</router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <section class="content table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Video ID</th>
                <th scope="col">Views</th>
                <th scope="col">Starting at</th>
                <th scope="col">Ending at</th>
                <th scope="col">Likes</th>
                <th scope="col">Dislikes</th>
                <th scope="col">Reports</th>
                <th scope="col">Changed by</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(video, index) in ytVideos"
                :key="index">
                <td>{{ (index + 1) + ((Page - 1) * limit) }}</td>
                <td :title="video.friendlyName">{{ (video.friendlyName == null ? 'NONE' : video.friendlyName) }}</td>
                <td>{{ video.videoId }}</td>
                <td>{{ video.views }}</td>
                <td>{{ video.start == 0 ? 'At video start' : video.start }}</td>
                <td>{{ video.end == null ? 'At video end' : video.end }}</td>
                <td>{{ video.likes }}</td>
                <td>{{ video.dislikes }}</td>
                <td>{{ video.reports }}</td>
                <td>{{ video.changedBy == null ? 'UFO' : video.changedBy }}</td>
                <td>
                  <router-link
                    :to="'ryt/edit/' + video._id"
                    class="btn btn-warning">Edit</router-link>
                  <button
                    class="btn btn-danger"
                    @click="vDelete(index, video._id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <nav
          v-if="pagination"
          aria-label="Navigation">
          <ul
            class="pagination justify-content-center"
            @click="changePage()">
            <li
              class="page-item"
              v-if="Page > 1"><router-link
                :to="'ryt?page=' + (Page - 1)"
                class="page-link">Previous</router-link></li>
            <li
              class="page-item"
              v-if="(Page - 3) >= 1"><router-link
                :to="'ryt?page=' + (Page - 3)"
                class="page-link">{{ Page - 3 }}</router-link></li>
            <li
              class="page-item"
              v-if="(Page - 2) >= 1"><router-link
                :to="'ryt?page=' + (Page - 2)"
                class="page-link">{{ Page - 2 }}</router-link></li>
            <li
              class="page-item"
              v-if="(Page - 1) >= 1"><router-link
                :to="'ryt?page=' + (Page - 1)"
                class="page-link">{{ Page - 1 }}</router-link></li>
            <li class="page-item active"><router-link
              :to="'ryt?page=' + Page"
              class="page-link">{{ Page }}</router-link></li>
            <li
              class="page-item"
              v-if="(Page + 1) <= Pages"><router-link
                :to="'ryt?page=' + (Page + 1)"
                class="page-link">{{ Page + 1 }}</router-link></li>
            <li
              class="page-item"
              v-if="(Page + 2) <= Pages"><router-link
                :to="'ryt?page=' + (Page + 2)"
                class="page-link">{{ Page + 2 }}</router-link></li>
            <li
              class="page-item"
              v-if="(Page + 3) <= Pages"><router-link
                :to="'ryt?page=' + (Page + 3)"
                class="page-link">{{ Page + 3 }}</router-link></li>
            <li
              class="page-item"
              v-if="Page < Pages"><router-link
                :to="'ryt?page=' + (Page + 1)"
                class="page-link">Next</router-link></li>
          </ul>
        </nav>
      </div>
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
      pagination: false
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
td {
  text-overflow:ellipsis;
  overflow:hidden;
  white-space:nowrap;
  max-width: 200px;
}

.content {
  min-height: 250px;
  padding: 15px;
  margin: 0;
  padding-left: 15px;
  padding-right: 15px;
}

.content-header {
  background: transparent;
  position: relative;
  padding: 0px 15px 0 15px;
  display: block;
}

.content-header>h1 {
  margin: 0;
  padding-left: 8px;
  font-size: 24px;
  border-left: 6px solid black;
}
</style>
