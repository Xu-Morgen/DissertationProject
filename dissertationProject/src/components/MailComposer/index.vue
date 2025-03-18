<template>
    <a-modal
      :open="open"
      title="撰写邮件"
      @ok="handleSend"
      @cancel="handleCancel"
      destroyOnClose
      :styles="{ body: { maxHeight: '70vh' } }"
    >
      <!-- 收件人选择 -->
      <a-select
        v-model:value="selectedRecipients"
        placeholder="选择收件人"
        style="width: 100%; margin-bottom: 10px"
        :options="recipientOptions"
        mode="multiple"
        show-search
        option-filter-prop="label"
      />
  
      <!-- 关联任务选择 -->
      <a-select
        v-model:value="selectedTask"
        placeholder="关联任务"
        style="width: 100%; margin-bottom: 10px"
        :options="taskOptions"
        show-search
        option-filter-prop="label"
        @change="handleTaskSelect"
      />
  
      <!-- 邮件主题 -->
      <a-input
        v-model:value="emailSubject"
        placeholder="邮件主题"
        style="width: 100%; margin-bottom: 10px"
      />
  
      <!-- 邮件正文 -->
      <a-textarea
        v-model:value="emailContent"
        placeholder="邮件正文"
        :rows="6"
        style="width: 100%; margin-bottom: 10px"
      />
  
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSend">发送</a-button>
      </template>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useEmailStore, useTaskStore, useEventStore } from '@/stores';
  import { GAME_EVENTS } from '@/data/events';
  import type { Email, Recipient } from '@/types';
  
  const props = defineProps<{
    open: boolean;
  }>();
  
  const emit = defineEmits(['update:open', 'send']);
  
  const emailStore = useEmailStore();
  const taskStore = useTaskStore();
  const eventStore = useEventStore();
  
  // 表单数据
  const selectedRecipients = ref<string[]>([]);
  const selectedTask = ref<string | null>(null);
  const emailSubject = ref('');
  const emailContent = ref('');
  
  // 收件人选项
  const recipientOptions = computed(() => 
    emailStore.contacts
      .filter(c => c.isUnlocked)
      .map(c => ({
        value: c.id,
        label: c.name
      }))
  );
  
  // 任务选项
  const taskOptions = computed(() =>
    taskStore.backlog
      .filter(t => t.status !== 'done')
      .map(t => ({
        value: t.id,
        label: `${t.title} (${t.status})`
      }))
  );
  
  // 处理任务选择
  const handleTaskSelect = (taskId: string) => {
    const task = taskStore.backlog.find(t => t.id === taskId);
    if (task) {
      emailSubject.value = `关于任务：${task.title}`;
    }
  };
  
  // 发送邮件
  const handleSend = () => {
    if (!validateForm()) return;
  
    const newEmail: Omit<Email, 'id' | 'isRead'> = {
      from: 'player',
      to: selectedRecipients.value,
      subject: emailSubject.value,
      content: emailContent.value,
      day: useCalendarStore().currentDay,
      replies: [],
      triggers: [],
      metadata: {
        requiresAction: false,
        category: 'sent',
        autoReply: false,
        associatedTask: selectedTask.value || undefined
      }
    };
  
    // 添加邮件
    emailStore.addEmail(newEmail);
  
    // 触发发送事件
    eventStore.triggerEvent('email_sent', GAME_EVENTS);
  
    // 通知父组件
    emit('send', newEmail);
    resetForm();
  };
  
  // 表单验证
  const validateForm = () => {
    if (selectedRecipients.value.length === 0) {
      alert('请选择至少一个收件人');
      return false;
    }
    if (!emailSubject.value) {
      alert('请输入邮件主题');
      return false;
    }
    if (!emailContent.value) {
      alert('请输入邮件正文');
      return false;
    }
    return true;
  };
  
  // 重置表单
  const resetForm = () => {
    selectedRecipients.value = [];
    selectedTask.value = null;
    emailSubject.value = '';
    emailContent.value = '';
    emit('update:open', false);
  };
  
  // 取消操作
  const handleCancel = () => {
    resetForm();
  };
  </script>
  
  <style scoped>
  /* 样式优化 */
  .ant-modal-body {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .ant-select, .ant-input, .ant-textarea {
    margin-bottom: 16px;
  }
  </style>