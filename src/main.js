import '@/assets/css/main.css'
import '@/assets/css/common.css'
import '@/assets/css/fragments.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import axios from 'axios';
import mitt from 'mitt';

import { HOST, PORT } from '@/config/config';

// axios
axios.defaults.baseURL = 'http://' + HOST + ':' + PORT + '/';
//axios.defaults.baseURL = window.location.origin + '/';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;

// mitt
let emitter = mitt();

const app = createApp(App)
app.config.globalProperties.emitter = emitter;
app.use(createPinia())
app.use(router)

app.mount('#app')
