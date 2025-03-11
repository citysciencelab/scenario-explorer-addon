
import Component from "./components/SimulationTool.vue";
import Store from "./store/index";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

import App from "../../src/App.vue";
import {createVuetify} from "vuetify";




export default {
    component: Component,
    store: Store,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
