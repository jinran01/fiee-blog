// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'

// Vuetify
import {createVuetify} from 'vuetify'


const Lighttheme = {
  dark: false,
  colors: {
    background: "#f2f5f8",
    surface: "#ffffff",
    primary: "#344767",
    secondary: "#334155",
    accent: "#048ba8",
    error: "#ef476f",
    info: "#2196F3",
    success: "#06d6a0",
    "on-success": "#ffffff",
    warning: "#ffd166",
  },
};

const Darktheme = {
  dark: true,
  colors: {
    background: "#111b27",
    surface: "#1E293B",
    primary: "#705CF6",
    secondary: "#598EF3",
    accent: "#D3E6FE",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",

  },
};
export default createVuetify({
      theme: {
        defaultTheme:'light',
        themes: {
          light: Lighttheme,
          dark: Darktheme
        }
      }
    }
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)
