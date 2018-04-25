<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <md-button
          class="md-icon-button"
          @click="showNavigation = !showNavigation">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">XaFF</span>
        <div class="md-toolbar-section-end">
          <md-avatar
            v-if="userHasGravatar"
            class="md-avatar-icon">
            <img
              :src="`https://gravatar.com/avatar/${this.userEmailMD5}?s=128`"
              alt="User avatar">
          </md-avatar>
          <md-avatar
            v-else
            class="md-avatar-icon">{{ name ? name[0] : userName[0] }}</md-avatar>
          <span class="md-title">{{ name ? name : userName }}</span>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="showNavigation">
        <md-toolbar
          class="md-transparent"
          md-elevation="0">
          <span class="md-title">Navigation</span>
        </md-toolbar>

        <md-list>
          <md-list-item to="/panel/users">
            <md-icon>account_box</md-icon>
            <span class="md-list-item-text">Users</span>
          </md-list-item>
          <md-list-item to="/panel/ryt">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Youtube RV</span>
          </md-list-item>
          <md-list-item @click="logout()">
            <md-icon>input</md-icon>
            <span class="md-list-item-text">Log Out</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
    <footer class="main-footer">
      <div class="main-footer-container">
        <div class="main-footer-section">
          <a href="https://github.com/iSm1le/xaff/blob/production/LICENSE">License</a>
          <a
            href="https://github.com/iSm1le"
            target="_blank">Made with <span class="heart">❤</span> by Mikhail K.
          </a>
        </div>
        <div class="main-footer-section">
          <b>Version</b> {{ appVer }}
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import auth from '../../auth';
import md5 from 'md5';
import { version } from '../../../package.json';

export default {
  data() {
    return {
      sidePanel: true,
      userName: '',
      name: '',
      userEmailMD5: '',
      currentUser: '',
      showNavigation: false,
      userHasGravatar: false
    };
  },
  methods: {
    logout() {
      auth.logout();
      this.$router.push('/');
    },
    async userGravatar() {
      const response = await this.$http.get(`https://en.gravatar.com/${this.userEmailMD5}.json`);
      if ([200, 302].indexOf(response.status) > -1) {
        return this.userHasGravatar = true;
      }
      return this.userHasGravatar = false;
    }
  },
  computed: {
    appVer() {
      return version;
    }
  },
  async created() {
    if (await !auth.checkAuth()) {
      this.logout();
    } else {
      this.currentUser = await auth.getUser();
      this.userName = this.currentUser.username;
      this.name = this.currentUser.name;
      this.userEmailMD5 = md5(this.currentUser.email);
      this.userGravatar();
      auth.updateToken(this);
    }
  }
};
</script>

<style lang="scss" scoped>

.page-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .md-app {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .md-app-toolbar {
      .end {
        flex: 1;
        justify-content: flex-end;
      }
      .md-avatar {
        margin-right: 0;
      }
    }

    .md-progress-bar {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
    }

    .md-drawer {
      width: 230px;
      max-width: calc(100vw - 125px);
    }

    .md-content {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

  }

  .main-footer {
    height: 96px;
    padding: 0 16px;
    position: relative;
    z-index: 4;
    background-color: #eee;

    .main-footer-container {
      max-width: 100%;
      height: 100%;
      display: -webkit-box;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      transition: .3s cubic-bezier(.4,0,.2,1);
      transition-property: max-width;

      a {
        color: #000;
      }

      a:hover {
        text-decoration: none;
        border-bottom: 1px solid currentColor;

        span.heart {
          color: #d32f2f;
          transform: scale(1.4);
        }
      }

      .main-footer-section {
        position: relative;

        a + a {
          margin-left: 32px;
        }

        span.heart {
          color: #f44336;
          display: inline-block;
          transition: .3s cubic-bezier(.4,0,.2,1);
        }

      }
    }
  }

}

</style>
