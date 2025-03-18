<script lang="ts" setup>
import { ref, computed, watch,h} from 'vue';
import { 
  useEmailStore, 
  useTaskStore, 
  useCalendarStore,
  useEventStore,
  useUIStore
} from '@/stores';
import { GAME_EVENTS } from '@/data/events';
import Inbox from '@/components/Inbox/index.vue';
import MailModal from '@/components/MailModal/index.vue';
import MailComposer from '@/components/MailComposer/index.vue';
import Kanban from '@/components/Kanban/index.vue';

import CalendarView from '@/components/Calendar/index.vue';


import ConfigModal from '@/components/ConfigModal/index.vue';
import { MailOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons-vue';

// Store 实例
const emailStore = useEmailStore();
const taskStore = useTaskStore();
const calendarStore = useCalendarStore();
const eventStore = useEventStore();
const uiStore = useUIStore();

// 当前视图状态
const currentView = ref<'mail' | 'kanban' | 'calendar'>('mail');

// 邮件相关状态
const activeEmail = ref<Email | null>(null);
const isComposing = ref(false);
const isReading = ref(false);

//选择meeting
const handleMeetingSelect = () =>{
  //TODO
}
//选择任务颜色
const statusColor = ["red","blue","white"]

// 任务过滤
const visibleTasks = computed(() => 
  taskStore.backlog.filter(t => t.status !== 'done')
);

// 处理邮件回复
const handleReply = (replyId: string) => {
  if (!activeEmail.value) return;
  
  // 触发事件
  eventStore.triggerEvent(
    activeEmail.value.replies.find(r => r.id === replyId)?.nextEventId,
    GAME_EVENTS
  );
  
  // 关闭模态框
  activeEmail.value = null;
};

// 处理每日推进
const advanceDay = () => {
  calendarStore.advanceDay();
  eventStore.triggerEvent('daily_check', GAME_EVENTS);
};

// 初始化加载
watch(() => uiStore.initialized, (initialized) => {
  if (initialized) {
    // 触发初始事件
    eventStore.triggerEvent('game_start', GAME_EVENTS);
  }
});
</script>

<template>
  <div class="main-layout">
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header">
        <ConfigModal />
        <a-button 
          type="primary" 
          shape="circle" 
          @click="uiStore.toggleConfig"
          :icon="h(ToolOutlined)" 
        />
        <span class="progress">
          进度: {{ taskStore.workflowProgress }}%
        </span>
        <span class="day">
          第 {{ calendarStore.currentDay }} 天
        </span>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout>
        <!-- 邮件编辑器 -->
        <MailComposer
          v-model:open="isComposing"
          @send="emailStore.addEmail"
        />

        <!-- 邮件阅读器 -->
        <MailModal
          v-model:open="isReading"
          :email="activeEmail"
          @reply="handleReply"
        />

        <a-layout-content class="content">
          <!-- 动态视图切换 -->
          <Inbox 
            v-show="currentView === 'mail'"
            @select-email="(email) => {
              activeEmail = email;
              isReading = true;
            }"
          />
          
          <Kanban 
            v-show="currentView === 'kanban'"
            @update-task="taskStore.upsertTask"
          />
          
          <CalendarView 
            v-show="currentView === 'calendar'"
            @select-meeting="handleMeetingSelect"
          />
        </a-layout-content>

        <!-- 右侧任务侧边栏 -->
        <a-layout-sider class="sider">
          <div class="task-panel">
            <h3>当前任务 ({{ visibleTasks.length }})</h3>
            <a-list item-layout="horizontal">
              <a-list-item 
                v-for="task in visibleTasks" 
                :key="task.id"
                :class="`priority-${task.priority}`"
              >
                <template #actions>
                  <a-tag :color="statusColor[task.status]">
                    {{ task.status }}
                  </a-tag>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ task.title }}
                  </template>
                  <template #description>
                    <span class="deadline" v-if="task.deadline">
                      D-{{ task.deadline - calendarStore.currentDay }}
                    </span>
                    <span>{{ task.description }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </a-layout-sider>
      </a-layout>

      <!-- 底部导航 -->
      <a-layout-footer class="footer">
        <div class="nav-bar">
          <a-button-group>
            <a-button 
              type="primary"
              :class="{ active: currentView === 'mail' }"
              @click="currentView = 'mail'"
            >
              <template #icon><MailOutlined /></template>
              邮箱
              <a-badge :count="emailStore.unreadCount" />
            </a-button>

            <a-button
              type="primary"
              :class="{ active: currentView === 'kanban' }"
              @click="currentView = 'kanban'"
            >
              <template #icon><AppstoreOutlined /></template>
              看板
            </a-button>

            <a-button
              type="primary"
              :class="{ active: currentView === 'calendar' }"
              @click="currentView = 'calendar'"
            >
              <template #icon><CalendarOutlined /></template>
              日历
            </a-button>
          </a-button-group>
          
          <a-button 
            type="primary" 
            @click="advanceDay"
          >
            下一天
          </a-button>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .progress {
      margin-left: auto;
      font-weight: 500;
    }

    .day {
      color: #666;
    }
  }

  .content {
    padding: 24px;
    background: #f0f2f5;
  }

  .sider {
    background: #fff;
    border-left: 1px solid #e8e8e8;
    padding: 16px;

    .task-panel {
      h3 {
        margin-bottom: 16px;
      }

      .deadline {
        color: #ff4d4f;
        margin-right: 8px;
      }
    }
  }

  .footer {
    padding: 16px;
    background: #fff;
    border-top: 1px solid #e8e8e8;

    .nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .active {
        border-color: #1890ff;
        background-color: #e6f7ff;
      }
    }
  }
}
</style>