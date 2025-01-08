import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import 'ant-design-vue/dist/reset.css';
import './style.css'
const app = createApp(App);
app.use(createPinia());
app.use(Antd);
app.use(router)
app.mount('#app');



