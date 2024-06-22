import '@/assets/css/main.css'
import '@/assets/css/common.css'
import '@/assets/css/fragments.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router/index.js'
import axios from 'axios';
import mitt from 'mitt';


// axios
axios.defaults.baseURL = 'http://' + import.meta.env.VITE_APP_HOST + ':' + import.meta.env.VITE_APP_PORT + '/';
// axios.defaults.headers.common = {
//     'X-Requested-With': 'XMLHttpRequest',
//     'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// }
axios.defaults.withXSRFToken = true;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.get['Access-Control-Allow-Origin'] = `${import.meta.env.VITE_APP_HOST}:${import.meta.env.VITE_APP_PORT}`;
axios.defaults.headers.patch['Access-Control-Allow-Origin'] = `${import.meta.env.VITE_APP_HOST}:${import.meta.env.VITE_APP_PORT}`;
axios.defaults.headers.delete['Access-Control-Allow-Origin'] = `${import.meta.env.VITE_APP_HOST}:${import.meta.env.VITE_APP_PORT}`;
axios.defaults.headers.options['Access-Control-Allow-Origin'] = `${import.meta.env.VITE_APP_HOST}:${import.meta.env.VITE_APP_PORT}`;

axios.defaults.withCredentials = true;

// mitt
let emitter = mitt();
let pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)
app.config.globalProperties.emitter = emitter;
app.provide('emitter', emitter)
app.use(pinia)
app.use(router)

window.emitter = mitt();

app.mount('#app')
