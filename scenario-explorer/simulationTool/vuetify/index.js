//import 'vuetify/lib/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';



const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#D6E3FF',
          darkblue: '#465166',
          orange: '#FFAD33',
          orangelight: '#FEE397',
          green: '#236051',
          greenlight: '#72CD86',
          purple: '#584560',
          purplelight: '#C2A7CD'
        },
      },
    },
  },
});

export default vuetify;