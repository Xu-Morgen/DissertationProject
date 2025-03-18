import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import EmailData from './data/emails'

import 'ant-design-vue/dist/reset.css';
import './style.css'
import { useEmailStore, useRootStore } from './stores';
import CommonUtils from './utils/utils';

//方法定义
const InitialTheGame = () =>{
    const root = useRootStore();
    if(root.firstTimePlay){
        useEmailStore().addEmail(CommonUtils.omitEmail(EmailData.SYSTEM_EMAILS[0]))
    }
    root.played()
}


//正文使用部分
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(Antd);
app.use(router)
app.mount('#app');

InitialTheGame()




