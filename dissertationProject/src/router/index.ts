import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Main from '@/views/mainFrame/main-frame.vue';
const routes: Array<RouteRecordRaw> = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: Home,
    // },
    {
        path: '/',
        name: 'Main',
        component: Main,
    },
    // {
    //     path: '/meeting/:id',
    //     name: 'MeetingRoom',
    //     component: () => import('../views/meetingRoom/MeetingRoom.vue'),
    //     meta: { requiresAuth: true }
    // },
    // {
    //     path: '/test',
    //     name: 'test',
    //     component: () => import('../views/test/test.vue'),
    //     meta: { requiresAuth: true }
    // },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});



export default router;
