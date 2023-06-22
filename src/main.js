import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import socket from '../socket'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
// Vuetify


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


createApp(App).use(store).use(router).use(socket).use(Vuetify).mount('#app')
