<script lang="ts" setup>
//用于在游戏设置当中时弹出的页面

import { useRouter } from 'vue-router';
import {useCalendarStore,useEmailStore,useEventStore,useRootStore,useTaskStore,useUIStore} from "@/stores/index"
const router = useRouter();


// 接收外部传入的 `open` 状态和 `Content`
const props = defineProps<{
  open: boolean;
}>();

const uiStore = useUIStore();

const resetGame = () =>{
    useCalendarStore().$reset()
    useEmailStore().$reset()
    useEventStore().$reset()
    useTaskStore().$reset()
    useUIStore().$reset()
    useRootStore().$reset()
    router.replace({ path: '/' });
}

// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open"]);


const handleCancel = () => {
  emit("update:open", uiStore.toggleConfig(false));
};
</script>

<template>
  <a-modal
    :open="open"
    title="Game Config"
    @ok="handleCancel"
    @cancel="handleCancel"
    destroyOnClose
  >
    <p>

      <a-button danger @click = "resetGame()">reset game</a-button>

    </p>
    <!-- 如果Content是HTML字符串，可以使用 v-html -->
    <!-- <p v-html="Content"></p> -->
  </a-modal>
</template>