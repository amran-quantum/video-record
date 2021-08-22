import Vue from 'vue'
import App from './App.vue'

import VueRecord from './components/index'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import locale from 'iview/dist/locale/en-US';

Vue.use(iView, { locale });

Vue.config.productionTip = false

Vue.use(VueRecord)

new Vue({
  render: h => h(App),
}).$mount('#app')
