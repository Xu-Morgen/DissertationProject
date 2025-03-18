<script lang="ts" setup>
import { computed } from 'vue';
import { useEmailStore, useEventStore } from '@/stores';
import { GAME_EVENTS } from '@/data/events';
import type { Email } from '@/types';
import { categoryColors } from '@/data/Global';

const props = defineProps<{
  open: boolean;
  email: Email | null;
}>();

const emit = defineEmits(['update:open']);

const emailStore = useEmailStore();
const eventStore = useEventStore();

// 处理邮件回复
const handleReply = (replyId: string) => {
  if (!props.email) return;

  // 处理回复逻辑
  emailStore.processReply(props.email.id, replyId);

  // 触发后续事件
  const reply = props.email.replies?.find(r => r.id === replyId);
  
  if (reply?.nextEventId) {
    eventStore.triggerEvent(reply.nextEventId, GAME_EVENTS);
  }
  
  closeModal();
};

// 关闭模态框
const closeModal = () => {
  emit('update:open', false);
};

// 格式化邮件内容
const formattedContent = computed(() => {
  return props.email?.content
    ?.replace(/ /g, '&nbsp;')
    .replace(/\n/g, '<br>') || '';
});
</script>

<template>
  <a-modal
    :open="open"
    :title="email?.subject"
    width="800px"
    @cancel="closeModal"
    :footer="null"
  >
    <div class="mail-modal-container">
      <!-- 邮件头信息 -->
      <div class="email-header">
        <div class="sender-info">
          <span class="sender-name">
            {{ emailStore.getContactName(email?.from) }}
          </span>
          <span class="send-day">第 {{ email?.day }} 天</span>
        </div>
        <a-tag v-if="email?.metadata.category" :color="categoryColors[email.metadata.category]">
          {{ email.metadata.category }}
        </a-tag>
      </div>

      <!-- 邮件正文 -->
      <div 
        class="email-content"
        v-html="formattedContent"
      />

      <!-- 邮件回复选项部分 -->
      <div v-if="email?.replies?.length && !emailStore.answeredEmail.some(t=>t.id == email?.id)" class="reply-actions">
        <a-button
          v-for="reply in email.replies"
          :key="reply.id"
          :type="reply.affectsSatisfaction ? 'primary' : 'default'"
          :danger="reply.affectsSatisfaction && reply.affectsSatisfaction < 0"
          @click="handleReply(reply.id)"
          class="reply-button"
        >
          {{ reply.text }}
          <span v-if="reply.requiresDays" class="days-cost">
            (需要{{ reply.requiresDays }}天)
          </span>
        </a-button>
      </div>

    </div>
  </a-modal>
</template>

<style scoped lang="less">
.mail-modal-container {
  padding: 16px;

  .email-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;

    .sender-info {
      display: flex;
      flex-direction: column;

      .sender-name {
        font-weight: 500;
        font-size: 16px;
      }

      .send-day {
        color: #666;
        font-size: 12px;
      }
    }
  }

  .email-content {
    line-height: 1.8;
    margin-bottom: 24px;

    :deep(br) {
      display: block;
      content: '';
      margin-bottom: 8px;
    }
  }

  .reply-actions {
    margin-top: 24px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;

    .reply-button {
      flex: 1;
      min-width: 200px;
    }

    .days-cost {
      margin-left: 8px;
      font-size: 0.8em;
      color: #666;
    }
  }
}

@category-colors: {
  system: #1890ff;
  client: #faad14;
  boss: #52c41a;
  team: #722ed1;
};

</style>