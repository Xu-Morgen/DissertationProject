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

// 当前选中的邮件
const activeEmail = ref<Email | null>(null);

// 控制收件箱和发件箱的显示
const isInbox = ref(true); // 默认为显示收件箱

// 邮件列表
const emails = computed(() => {
  return isInbox.value ? emailStore.inbox : emailStore.sent; // 根据 isInbox 显示不同的邮箱
});

// 处理邮件点击
const handleEmailClick = (email: Email) => {
  activeEmail.value = email;
  emailStore.markAsRead(email.id);
  uiStore.toggleReading(true);
};

</script>

<template>
  <!-- 切换收件箱和发件箱 -->
  <div class="email-switch-container">
    <a-switch
      v-model:checked="isInbox"
      :checkedChildren="'Inbox'"
      :unCheckedChildren="'Outbox'"
      style="margin-right: 16px;"
    />
    
    <!-- 发送按钮 -->
    <a-button 
      type="primary" 
      @click="uiStore.sendingEmailModalOpen = true"
      style="height: 32px;">
      Send
    </a-button>
  </div>

  <!-- 邮件阅读器 -->
  <MailModal
    v-model:open="uiStore.readingEmailModalOpen"
    :email="activeEmail"
  />

  <!-- 邮件编辑器 -->
  <MailComposer
    v-model:open="uiStore.sendingEmailModalOpen"
  />

  <div class="inbox-container">
    <!-- 邮件列表 -->
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
</template>

<style scoped lang="less">
.inbox-container {
  height: 70vh;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .email-list {
    .email-item {
      cursor: pointer;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.3s;

      &:hover {
        background: #fafafa;
      }

      &.unread {
        font-weight: 500;
      }

      .subject {
        margin-right: 8px;
      }

      .unread-badge {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #1890ff;
        border-radius: 50%;
      }

      .sender {
        color: #666;
        margin-right: 8px;
      }

      .day {
        color: #999;
        font-size: 0.9em;
      }
    }
  }
}

// 分类颜色映射
@category-colors: {
  system: #1890ff;
  client: #faad14;
  boss: #52c41a;
  team: #722ed1;
}

.email-switch-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;

}
</style>
