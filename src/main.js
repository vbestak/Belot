import Vue from 'vue'
import App from './App.vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
 
const socket = io('http://localhost:8085/');
 
Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
