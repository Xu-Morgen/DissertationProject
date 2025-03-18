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
        v-model:value="selectedRecipient"
        placeholder="选择收件人"
        style="width: 100%; margin-bottom: 10px"
        :options="recipientOptions"
        show-search
        option-filter-prop="label"
      />


      <!-- 邮件主题选择 -->
        <a-select
        v-model:value="selectedSubject"
        placeholder="选择主题"
        style="width: 100%; margin-bottom: 10px"
        :options="subjectOptions"
        mode='single'
        show-search
        option-filter-prop="label"
      />
  
      <!-- 邮件正文 -->
      <a-textarea
        v-model:value="emailContent"
        placeholder="邮件正文"
        :rows="6"
        style="width: 100%; margin-bottom: 10px"
        readonly
      />
  
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSend">发送</a-button>
      </template>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useEmailStore, useTaskStore, useEventStore, useCalendarStore, useUIStore } from '@/stores';
  import { GAME_EVENTS } from '@/data/events';
  import type { Email, Recipient, SentFormat } from '@/types';
  
  const props = defineProps<{
    open: boolean;
  }>();
  
  const emit = defineEmits(['update:open']);
  
  const emailStore = useEmailStore();
  const taskStore = useTaskStore();
  const eventStore = useEventStore();
  
// 选中的收件人和主题
const selectedRecipient = ref<Recipient>();  
const selectedSubject = ref<string>("");
const emailContent = ref<string>("");
const subject = ref<SentFormat[]>([]);
  
  // 收件人选项
  const recipientOptions = computed(() => 
    emailStore.contacts
      .filter(c => c.isUnlocked)
      .map(c => ({
        value: c.id,
        label: c.name
      }))
  );
  
  // 主题选项
  const subjectOptions = computed(() => {
    console.log(selectedRecipient.value)
    if (!selectedRecipient.value) return [];
    subject.value = emailStore.getSubjectsByRecipient(selectedRecipient.value);
    return subject.value.map(c=>({value:c.subject,label:c.subject}))
});

  
  // 自动变更主题内容
  watch(selectedSubject, (newSubject) => {
    const content = selectedSubject ? subject.value.find(t=>t.subject === selectedSubject.value)?.content : "";
    if(content){
      emailContent.value = content
    }

  });
  
  // 发送邮件
  const handleSend = () => {
    if (!validateForm()) return;
  
    const newEmail: Omit<Email, 'id' | 'isRead'> = {
      from: 'player',
      to: [selectedRecipient.value?.name as string],
      subject: selectedSubject.value,
      content: emailContent.value,
      day: useCalendarStore().currentDay,
      replies: [],
      triggers: [],
      metadata: {
        requiresAction: false,
        category: 'system',
        autoReply: false,
      }
    };

    console.log(newEmail)
  
    // 添加邮件
    emailStore.sentEmail(newEmail);
  
    const format = subject.value.find(t=>t.subject === selectedSubject.value)
    if(format?.nextEventId){
      eventStore.triggerEvent(format.nextEventId, GAME_EVENTS);

    }

    resetForm();
  };
  
  // 表单验证
  const validateForm = () => {
    // if (!selectedRecipient.value?.name) {
    //   alert('请选择至少一个收件人');
    //   return false;
    // }
    if (!selectedSubject) {
      alert('请选择邮件主题');
      return false;
    }
    return true;
  };
  
  // 重置表单
  const resetForm = () => {
    selectedRecipient.value = undefined 
    selectedSubject.value = ''
    emailContent.value = '';
    emit('update:open', useUIStore().toggleSending(false));
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