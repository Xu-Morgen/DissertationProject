<script lang="ts" setup>
// 修改后的组件逻辑
import { ref, watch, onMounted } from 'vue';
import { useEmailStore } from '../../../stores/emailStore';
import type { Email, SentEmail } from '../../../types/emails';

const emailStore = useEmailStore();

// 优化后的邮件列表示例
const columns = ref([
  { 
    title: '发件人/收件人', 
    dataIndex: 'participants', 
    key: 'participants',
    format: (record: Email) => 
      record.type === 'Sent' 
        ? `收件人：${record.recipients.join(', ')}`
        : `发件人：${record.sender}`
  },
  { title: '主题', dataIndex: 'subject', key: 'subject' },
  { 
    title: '时间', 
    dataIndex: 'timestamp', 
    key: 'time',
    format: (time: string) => new Date(time).toLocaleString()
  },
  { title: '操作', key: 'action' }
]);

// 获取动态邮件列表
const getFilteredEmails = () => {
  return emailStore.sortedEmails.filter(email => 
    isSent.value 
      ? email.type === 'Sent'
      : ['Task', 'Reply', 'Message'].includes(email.type)
};

// 邮件点击处理
const handleEmailClick = (email: Email) => {
  if (email.type === 'Task' && !email.task.isAccepted) {
    emailStore.acceptTask(email.task.id);
  }
  emailStore.markAsRead(email.id);
};
</script>

<template>
  <div class="inbox-container">
    <a-table 
      :columns="columns"
      :data-source="getFilteredEmails()"
      @row-click="handleEmailClick"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'participants'">
          {{ record.type === 'Sent' 
             ? `收件人：${record.recipients.join(', ')}`
             : `发件人：${record.sender}` }}
        </template>
        
        <template v-if="column.key === 'subject'">
          <a-tag v-if="record.type === 'Task'" color="blue">任务</a-tag>
          <span>{{ record.subject }}</span>
        </template>

        <template v-if="column.key === 'action'">
          <a-button @click.stop="openDetail(record)">
            {{ record.type === 'Task' ? '处理任务' : '查看详情' }}
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>