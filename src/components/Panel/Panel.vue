<template>
  <div id="panel">
    <header class="header">
      <a href="/panel/users" class="logo">
        <span class="logo-mini" style="display: none;">
          <b>X</b>
        </span>
        <span class="logo-lg">
          <b>XaFF</b>
        </span>
      </a>
      <nav class="navbar navbar-static-top"></nav>
    </header>
    <aside class="sidebar">
      <section class="asidebar">
        <div class="user-panel">
          <div class="pull-left image">
            <img :src="'//gravatar.com/avatar/' + userEmailMD5 + '?s=200'" alt="User Image" class="img-circle">
          </div>
          <div class="pull-left info">
            <p>{{ name || userName }}</p>
          </div>
        </div>
        <ul class="sidebar-menu">
          <li class="header">ADMINISTRATION</li>
          <router-link to="/panel/users" class="item">Users</router-link>
          <router-link to="/panel/ryt" class="item">Random YT</router-link>
          <a href="#" class="item" @click="logout()">Logout</a>
        </ul>
      </section>
    </aside>
    <div class="data-container">
      <div class="content">
        <router-view/>
      </div>
    </div>
    <footer class="mfooter">
      <div class="pull-left"><strong>Copyright © 2018</strong> Mikhail K. All rights reserved.</div>
      <div class="pull-right hidden-xs"><b>Version</b> {{ appVer }}</div>
    </footer>
  </div>
</template>

<script>
import auth from '../../auth'
import md5 from 'md5'
import { version } from '../../../package.json'

export default {
  data () {
    return {
      sidePanel: true,
      userName: '',
      name: '',
      userEmailMD5: '',
      currentUser: ''
    }
  },
  methods: {
    logout () {
      auth.logout()
      this.$router.push('/')
    }
  },
  computed: {
    appVer () {
      return version
    }
  },
  async created () {
    if (await !auth.checkAuth()) {
      auth.logout()
      this.$router.push('/')
    } else {
      this.currentUser = await auth.getUser()
      this.userName = this.currentUser.username
      this.name = this.currentUser.name
      this.userEmailMD5 = md5(this.currentUser.email)
      await auth.updateToken(this)
    }
  }
}
</script>

<style lang="scss">

@media (max-width: 767px) {
  .hidden-xs {
      display: none!important;
  }
}

.content {
  min-height: 250px;
  padding: 15px;
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.mfooter {
  display: block;
  background: #fff;
  padding: 15px;
  color: #444;
  height: 40px;
  border-top: 1px solid #d2d6de;
  -webkit-transition: -webkit-transform .3s ease-in-out,margin .3s ease-in-out;
  -moz-transition: -moz-transform .3s ease-in-out,margin .3s ease-in-out;
  -o-transition: -o-transform .3s ease-in-out,margin .3s ease-in-out;
  transition: transform .3s ease-in-out,margin .3s ease-in-out;
  margin-left: 230px;
  z-index: 820;
}

.data-container {
  min-height: 960px;
  background-color: #ecf0f5;
  z-index: 800;
  -webkit-transition: -webkit-transform .3s ease-in-out,margin .3s ease-in-out;
  -moz-transition: -moz-transform .3s ease-in-out,margin .3s ease-in-out;
  -o-transition: -o-transform .3s ease-in-out,margin .3s ease-in-out;
  transition: transform .3s ease-in-out,margin .3s ease-in-out;
  margin-left: 230px;
}

.item.open {
  background-color: #32383c;
}

.item:hover {
  text-decoration: none;
}

.item {
  color: white;
  padding: 8px;
  text-decoration: none;
  display: block;
  transition: 0.3s;
  background-color: #282e31;
}

.sidebar-menu .header {
  color: #4b646f;
  background: #1a2226;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  padding: 10px 25px 10px 15px;
  font-size: 12px;
  position: relative;
  margin: 0;
}

.sidebar-menu {
  white-space: nowrap;
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;
}

.user-panel>.info {
  color: #fff;
  padding: 5px 5px 5px 15px;
  line-height: 1;
  position: absolute;
  left: 55px;
}

img {
  vertical-align: middle;
  border: 0;
}

.img-circle {
  border-radius: 50%;
}

.user-panel>.image>img {
  width: 100%;
  max-width: 45px;
  height: auto;
}

.pull-right {
  float: right!important;
}

.pull-left {
  float: left!important;
}

.sidebar .user-panel {
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 10px;
}

section.asidebar {
  height: auto;
  padding-bottom: 10px;
  display: block;
}

aside.sidebar {
  display: block;
  background-color: #28373e;
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  min-height: 100%;
  width: 230px;
  z-index: 810;
  -webkit-transition: -webkit-transform .3s ease-in-out,width .3s ease-in-out;
  -moz-transition: -moz-transform .3s ease-in-out,width .3s ease-in-out;
  -o-transition: -o-transform .3s ease-in-out,width .3s ease-in-out;
  transition: transform .3s ease-in-out,width .3s ease-in-out;
}

.navbar {
  background-color: #3c8dbc;
  -webkit-transition: margin-left .3s ease-in-out;
  -o-transition: margin-left .3s ease-in-out;
  transition: margin-left .3s ease-in-out;
  margin-bottom: 0;
  margin-left: 230px;
  border: none;
  min-height: 50px;
  border-radius: 0;
}

header.header a.logo span.logo-lg {
  display: block;
}

header.header a.logo {
  text-decoration: none;
  background-color: #367fa9;
  -webkit-transition: width .3s ease-in-out;
  -o-transition: width .3s ease-in-out;
  transition: width .3s ease-in-out;
  display: block;
  float: left;
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  width: 230px;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  padding: 0 15px;
  font-weight: 300;
  overflow: hidden;
  color: #fff;
  border-bottom: 0 solid transparent;
  z-index: 998;
}

header.header {
  position: relative;
  max-height: 100px;
  z-index: 999;
}

#panel {
  width: 100%;
  height: auto;
  min-height: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #222d32;
}

</style>
