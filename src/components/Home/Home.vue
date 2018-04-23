<template>
  <div class="home">
    <md-button
      v-if="!authenticated"
      class="md-fab md-fab-bottom-right"
      to="/login">
      <md-icon>person</md-icon>
    </md-button>
    <md-button
      v-else
      class="md-fab md-fab-bottom-right"
      to="/panel/ryt">
      <md-icon>input</md-icon>
    </md-button>
  </div>
</template>

<script>
import auth from '../../auth';

export default {
  data() {
    return {
      authenticated: false
    };
  },
  async created() {
    this.authenticated = await auth.checkAuth();
  }
};
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    margin: auto;
    background:url(./../../assets/img/cover.jpg) #000 center no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
