<template>
  <div>
    <!-- 标题和操作栏 -->
    <a-page-header :title="title" :sub-title="subTitle">
      <template #extra>
        <a-button type="primary" @click="onCreateNew">{{ newButtonText }}</a-button>
      </template>
    </a-page-header>

    <!-- 邮件列表 -->
    <a-table
      :columns="columns"
      :data-source="emails"
      row-key="id"
    >
      <!-- 主题列 -->
      <template #subject="{ text }">
        <a>{{ text }}</a>
      </template>

      <!-- 操作列按钮 -->
      <template #action="{ record }">
        <a-button type="primary" @click="onActionClick(record)">点击查看</a-button>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';

// 使用 defineProps 接收父组件传递的参数
const props = defineProps({
  initialEmails: { type: Array, default: () => [] }, // 初始邮件列表
  title: { type: String, default: '收件箱' },
  subTitle: { type: String, default: '查看和管理邮件' },
  newButtonText: { type: String, default: '新邮件' },
});

// 定义 emits
const emit = defineEmits(['create-new']);

// 使用传入的 initialEmails 初始化本地数据
const emails = ref([...props.initialEmails]);

// 表格列配置
const columns = [
  { title: '发件人', dataIndex: 'sender', key: 'sender' },
  { title: '主题', dataIndex: 'subject', key: 'subject', scopedSlots: { customRender: 'subject' } },
  { title: '时间', dataIndex: 'time', key: 'time' },
  // 添加操作列
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },  // 使用 scopedSlots 来渲染操作按钮
  },
];

// 新邮件按钮点击事件
const onCreateNew = () => {
  emit('create-new');
};

// 操作按钮点击事件
const onActionClick = (record: any) => {
  alert(`点击了邮件：${record.subject}\n发件人：${record.sender}\n时间：${record.time}`);
};
</script>

<style scoped>
.filter-section {
  margin-bottom: 16px;
}
</style>
