<script lang="ts" setup>
//用于在游戏设置当中时弹出的页面
import { useGameConfig } from '../../stores/config';
import { useGlobalStore } from '../../stores/global';
import { useRouter } from 'vue-router';

const router = useRouter();
const config =  useGameConfig();
const store = useGlobalStore();

// 接收外部传入的 `open` 状态和 `Content`
const props = defineProps<{
  open: boolean;
}>();

const resetGame = () =>{
  config.setFirstTime(true);
  store.clearMails();
  router.replace({ path: '/' });
}

// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open"]);


const handleCancel = () => {
  emit("update:open", false);
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
