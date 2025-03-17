<template>
  <a-modal
    :open="open"
    title="Compose Email"
    @ok="handleSend"
    @cancel="handleCancel"
    destroyOnClose
    :styles="{ body: { maxHeight: '70vh' } }"
  >
    <!-- 收件人选择 -->
    <a-select
      v-model:value="selectedReceiver"
      placeholder="Send to"
      style="width: 100%; margin-bottom: 10px"
      :options="receiverOptions"
      mode="multiple"
      show-search
      option-filter-prop="label"
      @change="handleRecipientSelect"
    />

    <!-- 关联任务选择 -->
    <a-select
      v-model:value="selectedTask"
      placeholder="About (Select Task)"
      style="width: 100%; margin-bottom: 10px"
      :options="taskOptions"
      show-search
      option-filter-prop="label"
      @change="handleTaskSelect"
    />

    <!-- 邮件主题选择 -->
    <a-textarea
      v-model:value="emailSubject"
      placeholder="Email subject"
      style="width: 100%; margin-bottom: 10px"
      readonly
    />

    <!-- 邮件正文选择 -->
    <a-select
      v-model:value="selectedContent"
      :options="emailOptions"
      placeholder="Email Content(Select Reply)"
      :rows="6"
      option-filter-prop="label"
      style="width: 100%; margin-bottom: 10px"
    />

    <template #footer>
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" @click="handleSend">Send</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Recipient, Task, UserTask } from '../../../../stores/type';
import { useGlobalStore } from '../../../../stores/global';
import { useEmails } from '../../../../stores/emails';
import { useUserTasks } from '../../../../stores/userTask';
import Reply from '../../../../assets/data/Reply';

const props = defineProps<{
  open: boolean;

}>();
//创建状态实例
const store = useGlobalStore();
const userTasks = useUserTasks();
const emailList = useEmails();

const emit = defineEmits(["update:open", "sendEmail"]);

const receivers:Recipient[] = store.recipients;
const tasks:Task[] = store.tasks;
const userTask:UserTask[] = userTasks.tasks
// 表单数据
const selectedReceiver = ref<number[]>([]);
const selectedTask = ref<string>();
const emailSubject = ref('');
const selectedContent = ref('');
const emailOptions = ref<{ value: string; label: string }[]>([]);


// watch 监听器
watch([selectedReceiver, selectedTask], () => {
  if (!selectedTask.value || selectedReceiver.value.length === 0) return;

  // 查找匹配的 `Reply` 规则
  const matchedReply = Reply.ReplyList.find(reply =>
    // 根据收件人的 ID 和任务的标题匹配
    reply.relate.some(r => selectedReceiver.value.includes(r)) &&
    reply.about === selectedTask.value
  );

  // 如果找到匹配的 `Reply`，自动填充邮件主题和内容
  if (matchedReply) {
    emailSubject.value = matchedReply.subject;

    // 更新 emailOptions
    emailOptions.value = matchedReply.content.map(contentItem => ({
      value: contentItem.value,
      label: contentItem.label,
    }));
  }
});



// 计算属性
const receiverOptions = computed(() => 
  receivers.map(r => ({ value: r.id, label: r.Name , receivers:r}))
);

const taskOptions = computed(() =>
  [...tasks, ...userTask].map(t => ({
    value: t.subject,
    label: `${t.subject} (${t.isFinished ? "Finished" : "Pending"})`,
    task: t 
  }))
);





const handleTaskSelect = (taskId: string) => {
  selectedTask.value = taskId
};

const handleRecipientSelect = (Recipient:any)=>{
  console.log(Recipient)
}


// 发送处理
const handleSend = () => {
  if (!validateForm()) return;

  const emailData = {
    receivers: selectedReceiver.value,
    subject: selectedSubject.value,
    content: [emailContent.value, taskReplyContent.value]
      .filter(Boolean).join('\n\n'),
    relatedTask: selectedTask.value,
    taskReply: taskReplyContent.value
  };

  emit('sendEmail', emailData);
  resetForm();
};

// 表单验证
const validateForm = () => {
  if (selectedReceiver.value.length === 0) {
    alert('Please select at least one receiver');
    return false;
  }
  if (!selectedContent.value) {
    alert('Please enter email content');
    return false;
  }
  return true;
};

// 重置表单
const resetForm = () => {
  selectedReceiver.value = [];
  selectedTask.value = undefined;
  emailSubject.value = '';
  selectedContent.value = '';
  emailOptions.value = [];
  emit('update:open', false);
};

const handleCancel = () => {
  resetForm();
};
</script>

<style scoped>
.task-related-section {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
}

.task-preview {
  margin-top: 12px;
  padding: 8px;
  background: #fafafa;
  border-radius: 2px;
}

.task-preview h4 {
  margin-bottom: 8px;
  color: #1890ff;
}

.task-preview p {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9em;
}
</style>