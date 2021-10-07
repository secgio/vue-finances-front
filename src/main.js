/* Configurações gerais do que será usado */

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { errorHandler } from '@/utils'
import vuetify from '@/plugins/vuetify'
import '@/plugins/vuelidate'
import '@/plugins/moment'

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
