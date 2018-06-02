// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import auth from './auth';

Vue.config.productionTip = false;

auth.checkAuth();

Vue.prototype.apiEndpoint = 'https://api.xaff.ru';
Vue.prototype.gApiEndpoint = 'https://www.googleapis.com/youtube/v3/videos';
Vue.prototype.gApiKey = 'AIzaSyBCzvJcO9dv-cxb3CNwYQ89hohqsBAubUQ';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

/*
  TODO:
  Add multiple items without page reload
  FIXME:
*/
