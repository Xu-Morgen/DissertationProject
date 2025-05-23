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

const handleReply = (replyId: string) => {
  if (!props.email) return;

  emailStore.processReply(props.email.id, replyId);

  const reply = props.email.replies?.find(r => r.id === replyId);
  
  if (reply?.nextEventId) {
    eventStore.triggerEvent(reply.nextEventId, GAME_EVENTS);
  }
  
  closeModal();
};

const closeModal = () => {
  emit('update:open', false);
};

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
      <div class="email-header">
        <div class="sender-info">
          <span class="sender-name">
            {{ emailStore.getContactName(email?.from) }}
          </span>
          <span class="send-day">Day:{{ email?.day }} </span>
        </div>
        <a-tag v-if="email?.metadata.category" :color="categoryColors[email.metadata.category]">
          {{ email.metadata.category }}
        </a-tag>
      </div>

      <div 
        class="email-content"
        v-html="formattedContent"
      />

      <div v-if="email?.replies?.length && !emailStore.answeredEmail.some(t=>t.id == email?.id)" class="reply-actions">
        <a-button
          v-for="reply in email.replies"
          :key="reply.id"
          @click="handleReply(reply.id)"
          class="reply-button"
        >
          {{ reply.text }}
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