import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../views/start/HelloWorld.vue';
import Test from '../views/test/test.vue';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/test',
        name: 'Test',
        component: Test,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
