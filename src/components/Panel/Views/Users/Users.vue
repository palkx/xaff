<template>
  <div class="page-container">
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Users</h1>
        <md-button
          class="md-icon-button md-primary"
          to="/panel/users/add">
          <md-icon>add</md-icon>
        </md-button>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Username</md-table-head>
        <md-table-head>Email</md-table-head>
        <md-table-head>Roles</md-table-head>
        <md-table-head>Changed By</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="(user, index) in users"
        :key="index">
        <md-table-cell>{{ (index + 1) + ((Page - 1) * limit) }}</md-table-cell>
        <md-table-cell>{{ (user.name == null ? 'NONE' : user.name) }}</md-table-cell>
        <md-table-cell>{{ user.username }}</md-table-cell>
        <md-table-cell>{{ user.email }}</md-table-cell>
        <md-table-cell>IN DEV</md-table-cell>
        <md-table-cell :title="user.updated">{{ user.changedBy == null ? 'UFO' : user.changedBy }}</md-table-cell>
        <md-table-cell>
          <md-button
            :to="`users/edit/${user._id}`"
            class="md-raised md-primary">Edit
          </md-button>
          <md-button
            class="md-raised md-accent"
            @click="uDelete(index, user._id)">Delete
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
      users: null,
      limit: 15,
      Pages: 0,
      pagination: false,
      currentUser: ''
    };
  },
  methods: {
    changePage() {
      this.getUsers();
    },
    async uDelete(i, id) {
      try {
        const response = await this.$http.delete(`${this.apiEndpoint}/users/id/${id}`, { headers: await auth.getAuthHeader() });
        if (response.status === 200) {
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': `User ${id} deleted successfully`,
            'reverse': true
          });
          this.users.splice(i, 1);
          if (this.users.length <= 0) {
            if (this.Page > 1) {
              this.$router.push(`/panel/users?page=${this.Page - 1}`);
              this.changePage();
            }
          }
        }
      } catch (e) {
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'Users',
          'text': 'Can`t delete user',
          'reverse': true
        });
      }
    },
    async getUsers() {
      try {
        const response = await this.$http.get(`${this.apiEndpoint}/users?limit=${this.limit}&page=${this.Page}`, { headers: await auth.getAuthHeader() });
        this.users = response.body;
      } catch (e) {
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'Users',
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
      const response = await this.$http.get(`${this.apiEndpoint}/users/count`, { headers: await auth.getAuthHeader() });
      if (response.body >= this.limit) {
        this.pagination = true;
        this.Pages = Math.floor(Number(response.body - 1) / this.limit) + 1;
      }
    } catch (e) {
      this.$notify({
        'group': 'responses',
        'type': 'error',
        'animation-type': 'velocity',
        'title': 'Users',
        'text': 'Undefined error',
        'reverse': true
      });
      if (this.Page - 1 > this.Pages) {
        this.$router.push('/panel/users');
      }
    }
    await this.getUsers();
  }
};
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
