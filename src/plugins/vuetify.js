import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'light',

    themes: {
      light: {
        colors: {
          primary: '#4F46E5',
          secondary: '#64748B',
          success: '#16A34A',
          error: '#DC2626',
          warning: '#D97706',
          background: '#F8FAFC',
          surface: '#FFFFFF'
        }
      }
    }
  },

  icons: {
    defaultSet: 'mdi'
  }
})

export default vuetify