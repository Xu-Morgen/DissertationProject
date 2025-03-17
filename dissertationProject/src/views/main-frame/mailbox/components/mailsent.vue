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
    <a-auto-complete
      v-model:value="selectedSubject"
      :options="emailOptions"
      placeholder="Email Subject"
      style="width: 100%; margin-bottom: 10px"
    />

    <!-- 任务相关回复内容 -->
    <div v-if="selectedTaskContent" class="task-related-section">
      <a-textarea
        v-model:value="taskReplyContent"
        placeholder="Task-related reply content"
        :rows="4"
        style="margin-bottom: 10px"
      />
      <div class="task-preview">
        <h4>Selected Task Details:</h4>
        <p>{{ selectedTaskContent }}</p>
      </div>
    </div>

    <!-- 邮件正文编辑 -->
    <a-textarea
      v-model:value="emailContent"
      placeholder="Email content"
      :rows="6"
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
import type { Task } from '../../../../stores/type';

const props = defineProps<{
  open: boolean;
  emailList: { subject: string; type: string }[];
  receivers: string[];       // 新增收件人列表
  tasks: Task[];             // 新增任务列表
}>();

const emit = defineEmits(["update:open", "sendEmail"]);

// 表单数据
const selectedReceiver = ref<string[]>([]);
const selectedTask = ref<string>();
const selectedSubject = ref('');
const emailContent = ref('');
const taskReplyContent = ref('');

// 计算属性
const receiverOptions = computed(() => 
  props.receivers.map(r => ({ value: r, label: r }))
);

const taskOptions = computed(() =>
  props.tasks.map(t => ({
    value: t.id,
    label: `${t.title} (${t.status})`,
    task: t // 保留完整任务对象
  }))
);

const emailOptions = computed(() =>
  props.emailList.map(email => ({ value: email.subject }))
);

// 当前选中任务内容
const selectedTaskContent = computed(() => {
  const task = props.tasks.find(t => t.id === selectedTask.value);
  return task ? `
    Title: ${task.title}
    Status: ${task.status}
    Deadline: ${task.deadline}
    Description: ${task.description}
  ` : '';
});

// 处理任务选择
const handleTaskSelect = (taskId: string) => {
  const task = props.tasks.find(t => t.id === taskId);
  if (task) {
    // 自动生成任务相关回复建议
    taskReplyContent.value = `Regarding task "${task.title}":\n\n`;
    emailContent.value = `Reference Task: ${task.title}\nStatus: ${task.status}\n\n`;
  }
};

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
  if (!selectedSubject.value) {
    alert('Please enter email subject');
    return false;
  }
  return true;
};

// 重置表单
const resetForm = () => {
  selectedReceiver.value = [];
  selectedTask.value = undefined;
  selectedSubject.value = '';
  emailContent.value = '';
  taskReplyContent.value = '';
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