<script lang="ts" setup>
//用于在点击邮件页面detail当中时弹出的页面
import { useGlobalStore } from '../../../../stores/global';
import type { Task } from '../../../../stores/type';

const store = useGlobalStore();


// 接收外部传入的 `open` 状态和 `Content`
const props = defineProps<{
  open: boolean;
  content: string;
}>();

// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open", "ok"]);

const handleOk = (e: MouseEvent) => {
  console.log(e);
  emit("ok", e); // 触发 `ok` 事件，通知父组件
  emit("update:open", false); // 关闭模态框
  if(store.currentEmail.type == "Task"){
    store.addTask(store.currentEmail.typeContent as Task)
  }

};

const handleCancel = () => {
  emit("update:open", false);
};
</script>

<template>
  <a-modal
    :open="open"
    title="Basic Modal"
    @ok="handleCancel"
    @cancel="handleCancel"
    destroyOnClose
  >
    <p>{{ content }}</p>
    <!-- 如果Content是HTML字符串，可以使用 v-html -->
    <!-- <p v-html="Content"></p> -->

    <template #footer>
      <a-button key="back" @click="handleCancel">Pending</a-button>
      <a-button key="reject" type="primary" @click="handleOk" danger>Reject</a-button>
      <a-button key="accept" type="primary" @click="handleOk">Accept</a-button>
    </template>
  </a-modal>
</template>
