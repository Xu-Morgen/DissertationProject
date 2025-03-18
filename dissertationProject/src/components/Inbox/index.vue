<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useEmailStore, useEventStore } from '@/stores';
import { GAME_EVENTS } from '@/data/events';
import type { Email } from '@/types';
import { MailOutlined } from '@ant-design/icons-vue';

const emailStore = useEmailStore();
const eventStore = useEventStore();

// 当前选中的邮件
const activeEmail = ref<Email | null>(null);

// 邮件列表
const emails = computed(() => emailStore.inbox);

// 处理邮件点击
const handleEmailClick = (email: Email) => {
  activeEmail.value = email;
  emailStore.markAsRead(email.id);

  // 触发邮件打开事件
  if (email.triggers.length > 0) {
    email.triggers.forEach(trigger => {
      eventStore.triggerEvent(trigger, GAME_EVENTS);
    });
  }
};

// 处理邮件回复
const handleReply = (replyId: string) => {
  if (!activeEmail.value) return;

  // 处理回复逻辑
  emailStore.processReply(activeEmail.value.id, replyId);

  // 触发后续事件
  const reply = activeEmail.value.replies.find(r => r.id === replyId);
  if (reply?.nextEventId) {
    eventStore.triggerEvent(reply.nextEventId, GAME_EVENTS);
  }

  // 关闭模态框
  activeEmail.value = null;
};

// 格式化邮件内容
const formatContent = (content: string) => {
  return content
    .replace(/ /g, '&nbsp;')
    .replace(/\n/g, '<br>');
};
</script>

<template>
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
              <span class="day">第 {{ item.day }} 天</span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <!-- 邮件详情模态框 -->
    <a-modal
      v-model:open="activeEmail"
      :title="activeEmail?.subject"
      width="800px"
      @cancel="activeEmail = null"
    >
      <div class="email-content">
        <!-- 发件人信息 -->
        <div class="email-header">
          <span class="sender">
            {{ emailStore.getContactName(activeEmail?.from) }}
          </span>
          <span class="day">第 {{ activeEmail?.day }} 天</span>
        </div>
        
        <!-- 邮件正文 -->
        <div 
          class="email-body"
          v-html="formatContent(activeEmail?.content || '')"
        />

        <!-- 回复选项 -->
        <div v-if="activeEmail?.replies?.length" class="reply-actions">
          <a-button
            v-for="reply in activeEmail.replies"
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
  </div>
</template>

<style scoped lang="less">
.inbox-container {
  height: 100%;
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

  .email-content {
    .email-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      color: #666;
      
      .day {
        font-size: 0.9em;
      }
    }

    .email-body {
      line-height: 1.6;
      border-top: 1px solid #eee;
      padding-top: 16px;
    }

    .reply-actions {
      margin-top: 24px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
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
</style>