<script lang="ts" setup>
import { ref, computed, watch, h } from 'vue';
import { 
  useEmailStore, 
  useTaskStore, 
  useCalendarStore,
  useEventStore,
  useUIStore,
  useRootStore
} from '@/stores';
import { GAME_EVENTS } from '@/data/events';
import Inbox from '@/components/Inbox/index.vue';

import Kanban from '@/components/Kanban/index.vue';
import CalendarView from '@/components/Calendar/index.vue';
import ConfigModal from '@/components/ConfigModal/index.vue';
import { MailOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons-vue';
import {statusColor} from '@/data/Global'
import type { Email } from '@/types';
// Store 实例
const emailStore = useEmailStore();
const taskStore = useTaskStore();
const calendarStore = useCalendarStore();
const eventStore = useEventStore();
const uiStore = useUIStore();
const rootStore = useRootStore();

// 当前视图状态
const currentView = ref<'mail' | 'kanban' | 'calendar'>('mail');

// 邮件相关状态
const activeEmail = ref<Email | null>(null);



//选择meeting
const handleMeetingSelect = () => {
  //TODO
}

// 任务过滤
const visibleTasks = computed(() => 
  taskStore.backlog.filter(t => t.status !== 'done')
);



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
        <ConfigModal :open="uiStore.configModalOpen"/>
        <a-button 
          type="primary" 
          shape="circle" 
          @click="uiStore.toggleConfig(true)"
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
            <div class="task-list">
              <a-card
                v-for="task in visibleTasks" 
                :key="task.id"
                class="task-card"
                :class="`priority-${task.priority}`"
                hoverable
              >
                <template #title>
                  {{ task.title }}
                </template>

                <template #extra>
                  <a-tag :color="statusColor[task.status]" class="status-tag">
                    {{ task.status }}
                  </a-tag>
                </template>

                <p>
                  <span class="deadline" v-if="task.deadline">
                    D-{{ task.deadline - calendarStore.currentDay }}
                  </span>
                  <span>{{ task.description }}</span>
                </p>
              </a-card>
            </div>
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
  overflow: hidden; /* 防止滚动条 */

  /* 根布局 */
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
    max-width: 1600px; /* 限制最大宽度为 1600px 或根据需要调整 */
    margin: 0 auto;
    padding: 24px;
    background: #f0f2f5;
    flex-grow: 1; /* 允许内容区域伸展以填充剩余空间 */
  }

  /* 右侧任务栏样式，调整宽度 */
  .sider {
    background: #fff;
    border-left: 1px solid #e8e8e8;
    padding: 16px;
    flex-shrink: 0; /* 确保任务栏不会缩小 */
    width: 350px !important; /* 调整任务栏宽度为 400px，可以根据需要进一步增加或减少 */
    min-width: 350px !important;
    max-width: 350px !important;

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