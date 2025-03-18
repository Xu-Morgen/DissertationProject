<script setup lang="ts">

// App.vue
import { useCalendarStore } from './stores/calendarStore';
import { useTaskStore } from './stores/taskStore';
import { CLIENT_MEETINGS } from './data/meetings';
import { INITIAL_TASKS } from './data/tasks';

const calendarStore = useCalendarStore();
const taskStore = useTaskStore();



</script>

<template>
    <router-view/>
</template>
