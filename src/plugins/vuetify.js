/* Gerencia a parte visual da aplicação como as cores  */

import Vue from 'vue'
import pt from 'vuetify/lib/locale/pt'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt'
  },
  icons: {
    iconfont: 'md'
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.teal.darken1,
        accent: colors.indigo.darken1,
        info: colors.blue,
        error: colors.pink.darken2,
        sucess: colors.teal.lighten1,
        warning: colors.purple.darken1
      }
    }
  }
})
