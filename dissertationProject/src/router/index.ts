import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../views/start/HelloWorld.vue';
import Main from '../views/main-frame/ main-frame.vue';
import { useGlobalStore } from '../stores/global';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/main',
        name: 'Main',
        component: Main,
    },
    {
        path: '/meeting/:id',
        name: 'MeetingRoom',
        component: () => import('../views/meetingRoom/MeetingRoom.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/test/test.vue'),
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// router.ts
// router.beforeEach((to, from, next) => {
//     const store = useGlobalStore();
    
//     if (store.meetingInProgress) {
//       alert('请先完成会议室内容！');
//       next(false);
//     } else {
//       next();
//     }
//   });

export default router;
