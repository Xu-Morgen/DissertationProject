<script setup lang="ts">

// App.vue
import { useCalendarStore } from './stores/calendarStore';
import { useTaskStore } from './stores/taskStore';
import { CLIENT_MEETINGS } from './data/meetings';
import { INITIAL_TASKS } from './data/tasks';

const calendarStore = useCalendarStore();
const taskStore = useTaskStore();

// 初始化会议
calendarStore.events = [
  ...CLIENT_MEETINGS.map(m => ({ ...m, id: `${m.id}_${Date.now()}` }))
];

// 初始化任务
taskStore.backlog = INITIAL_TASKS.map(t => ({
  ...t,
  createdAt: calendarStore.currentDay
}));

</script>

<template>
    <router-view/>
</template>
