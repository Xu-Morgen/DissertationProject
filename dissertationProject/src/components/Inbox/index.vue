<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useEmailStore, useEventStore, useUIStore } from '@/stores';
import { GAME_EVENTS } from '@/data/events';
import type { Email } from '@/types';
import MailModal from '@/components/MailModal/index.vue';
import MailComposer from '@/components/MailComposer/index.vue';
import { categoryColors } from '@/data/Global';

const emailStore = useEmailStore();
const eventStore = useEventStore();
const uiStore = useUIStore();

const activeEmail = ref<Email | null>(null);
const isInbox = ref(true);

const emails = computed(() => {
  return isInbox.value ? emailStore.inbox : emailStore.sent;
});

const handleEmailClick = (email: Email) => {
  activeEmail.value = email;
  emailStore.markAsRead(email.id);
  uiStore.toggleReading(true);
};
</script>

<template>
  <div class="email-switch-container">
    <a-switch
      v-model:checked="isInbox"
      checked-children="Inbox"
      un-checked-children="Outbox"
      style="margin-right: 16px;"
    />
    <a-button 
      type="primary" 
      @click="uiStore.sendingEmailModalOpen = true"
      style="height: 32px;"
    >
      Send
    </a-button>
  </div>

  <MailModal
    v-model:open="uiStore.readingEmailModalOpen"
    :email="activeEmail"
  />
  <MailComposer
    v-model:open="uiStore.sendingEmailModalOpen"
  />

  <div class="inbox-container">
    <div class="email-scroll-wrapper">
      <a-list
        :data-source="emails"
        item-layout="horizontal"
        class="email-list"
      >
        <template #renderItem="{ item }">
          <a-list-item
            :class="['email-item', { unread: !item.isRead }]"
            @click="handleEmailClick(item)"
          >
            <template #actions>
              <a-tag :color="categoryColors[item.metadata.category]">
                {{ item.metadata.category }}
              </a-tag>
            </template>
            <a-list-item-meta>
              <template #title>
                <span class="subject">{{ item.subject }}</span>
                <span v-if="!item.isRead" class="unread-badge" />
              </template>
              <template #description>
                <span class="sender">
                  {{ emailStore.getContactName(item.from) }}
                </span>
                <span class="day">Day:{{ item.day }} </span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<style scoped lang="less">
.inbox-container {
  height: 70vh;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  .email-scroll-wrapper {
    flex: 1;
    overflow-y: auto;
    margin: -16px;
    padding: 16px;

    &::-webkit-scrollbar {
      width: 8px;
      background: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }

    .email-list {
      min-width: 600px;

      :deep(.ant-list-item) {
        padding: 12px 8px;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.2s;
        cursor: pointer;

        &:hover {
          background: #fafafa;
        }

        .ant-list-item-meta {
          align-items: center;

          &-title {
            margin-bottom: 0;
            display: flex;
            align-items: center;
          }

          &-description {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
        }
      }
    }
  }
}

.email-switch-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  align-items: center;
}

.unread-badge {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  margin-left: 8px;
}

.subject {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.sender {
  color: rgba(0, 0, 0, 0.65);
  margin-right: 12px;
}
  
.day {
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.9em;
}

.email-item.unread {
  .subject {
    font-weight: 600;
  }
}
</style>