/* Core */
import Vue from 'vue';
import Router from 'vue-router';
import Resource from 'vue-resource';
import Notification from 'vue-notification'; // Notifications
import VueMaterial from 'vue-material'; // Material interface
import 'vue-material/dist/vue-material.min.css'; // Material css
import 'vue-material/dist/theme/default.css'; // Default material theme

/* Views */
import Home from '@/components/Home/Home';
import Login from '@/components/Home/Login';

/* Panel */
import Panel from '@/components/Panel/Panel';
import Users from '@/components/Panel/Views/Users/Users';
import UsersAdd from '@/components/Panel/Views/Users/Add';
import UsersEdit from '@/components/Panel/Views/Users/Edit';
import RandomYT from '@/components/Panel/Views/RandomYT/RandomYT';
import RandomYTAdd from '@/components/Panel/Views/RandomYT/Add';
import RandomYTEdit from '@/components/Panel/Views/RandomYT/Edit';

Vue.use(Router);
Vue.use(Resource);
Vue.use(Notification);
Vue.use(VueMaterial);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login page', component: Login },
    {
      path: '/panel',
      name: 'Panel',
      component: Panel,
      children: [
        { path: 'users', name: 'Users', component: Users },
        { path: 'users/add', name: 'Add user', component: UsersAdd },
        { path: 'users/edit/:id', name: 'Edit user', component: UsersEdit },
        { path: 'ryt', name: 'Random YT', component: RandomYT },
        { path: 'ryt/add', name: 'Add video', component: RandomYTAdd },
        { path: 'ryt/edit/:id', name: 'Edit video', component: RandomYTEdit }
      ]
    }
  ]
});
