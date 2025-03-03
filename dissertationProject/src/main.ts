import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import 'ant-design-vue/dist/reset.css';
import './style.css'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(Antd);
app.use(router)
app.mount('#app');

// router.beforeEach((to, from, next) => {
//     if (localStorage.getItem('meetingInProgress') === 'true') {
//       if (confirm('请先完成会议室内容！')) {
//         next(false);
//       } else {
//         next(false);
//       }
//     } else {
//       next();
//     }
//   });
