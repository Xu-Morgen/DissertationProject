<script setup lang="ts">

// App.vue
import { useCalendarStore } from './stores/calendarStore';
import { useTaskStore } from './stores/taskStore';

const calendarStore = useCalendarStore();
const taskStore = useTaskStore();



</script>

<template>
    <router-view/>
</template>
