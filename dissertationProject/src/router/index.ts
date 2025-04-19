import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Main from '@/views/mainFrame/main-frame.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/start/HelloWorld.vue'),
    },
    {
        path: '/main',
        name: 'Main',
        component: Main,
    },
    {
        path: '/survey',
        name: 'Survey',
        component: () => import('@/views/survey/Survey.vue') // 你可以自己创建 Survey 页面
      },
      
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});



export default router;
