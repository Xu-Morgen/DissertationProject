<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

// 接收外部传入的 `open` 状态
const props = defineProps<{
  open: boolean;
}>();

// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open", "ok"]);

const handleOk = (e: MouseEvent) => {
  console.log(e);
  emit("ok", e); // 触发 `ok` 事件，通知父组件
  emit("update:open", false); // 关闭模态框
};
</script>

<template>
  <a-modal
    :open="open"
    title="Basic Modal"
    @ok="handleOk"
    @cancel="emit('update:open', false)"
  >
    <slot>默认内容：Some contents...</slot>
  </a-modal>
</template>
