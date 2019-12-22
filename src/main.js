import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TreeView from './treeview.vue'
import Notifications from 'vue-notification';

export const bus = new Vue();

Vue.use(TreeView);
Vue.use(VueResource);
Vue.use(Bootstrap);
Vue.use(Notifications);

library.add(fas)
library.add(fab)
library.add(far)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

const Tree = {
  install(Vue) {
    Vue.component('tree-view', TreeView)
    Vue.component('fa', FontAwesomeIcon)
  }
}

export default Tree