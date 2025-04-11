<script lang="ts" setup>
import { ref, computed, watch, h, createVNode } from 'vue';
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
import { onMounted, nextTick } from 'vue'

import Kanban from '@/components/Kanban/index.vue';
import CalendarView from '@/components/Calendar/index.vue';
import ConfigModal from '@/components/ConfigModal/index.vue';
import { MailOutlined, AppstoreOutlined, CalendarOutlined,ToolOutlined,QuestionOutlined} from '@ant-design/icons-vue';
import {statusColor} from '@/data/Global'
import type { Email } from '@/types';
import type { TourProps } from 'ant-design-vue';
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

//新手引导
const tourStep = ref(0)
const tourStep1 = ref(null);
const tourStep2 = ref(null);
const tourStep3 = ref(null);
const tourStep4 = ref(null);
const tourStep5 = ref(null);
const tourStep6 = ref(null);




const steps: TourProps['steps'] = [
  // 步骤1 - 任务面板
  {
    title: 'Task Panel',
    description: 'View and manage your current tasks here, track deadlines and progress',
    target: () => tourStep1.value && tourStep1.value.$el,
  },
  // 步骤2 - 邮件视图
  {
    title: 'Mail Center',
    description: 'Check unread emails and handle important client communications',
    target: () => tourStep2.value && tourStep2.value.$el,
  },
  // 步骤3 - 看板视图
  {
    title: 'Kanban Board',
    description: 'Visualize task flow and manage work progress using kanban view',
    target: () => tourStep3.value && tourStep3.value.$el,
  },
  // 步骤4 - 日历视图
  {
    title: 'Project Calendar',
    description: 'Check meeting schedules and project timelines',
    target: () => tourStep4.value && tourStep4.value.$el,
  },
  // 步骤5 - 推进天数
  {
    title: 'Advance Day',
    description: 'Click here to advance game day after completing daily work',
    target: () => tourStep5.value && tourStep5.value.$el,
  },
  // 步骤6 - 帮助按钮
  {
    title: 'Help Center',
    description: 'Click the question mark anytime to review this tutorial',
    target: () => tourStep6.value && tourStep6.value.$el,
  }
];
const playTour = () => {
    tourStep.value = 0
    rootStore.handleTour(true)

};




//选择meeting
const handleMeetingSelect = () => {
  //TODO
}

// 任务过滤
const visibleTasks = computed(() => 
  taskStore.personaltTask.filter(t => t.status !== 'done')
);

// 处理每日推进
const advanceDay = () => {
  eventStore.triggerEvent('daily_check', GAME_EVENTS); 
  currentView.value = 'mail'
};

onMounted(() => {

  setTimeout(() => {

  if(rootStore.isFristTour){
    playTour();
    rootStore.handleFirstTour()
  }

  }, 200);

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
        <a-button 
          ref = 'tourStep6'
          type="primary" 
          shape="circle" 
          @click="playTour();"
          :icon="h(QuestionOutlined)" 
        />
        <span class="progress">
          Progres: {{ rootStore.workflowProgress }}%
        </span>
        <span class="day">
          Day:{{ calendarStore.currentDay }} 
        </span>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout>


        <a-layout-content class="content">
          <!-- 动态视图切换 -->
          <Inbox 
            v-if="currentView == 'mail'"
            @select-email="(email) => {
              activeEmail = email;
            }"  
          />
          
          <Kanban 
            v-if="currentView == 'kanban'"
          />
          
          <CalendarView 
            v-if="currentView == 'calendar'"
          />
        </a-layout-content>

        <!-- 右侧任务侧边栏 -->
        <a-layout-sider class="sider" ref ="tourStep1">
          <div class="task-panel" >
            <div >
            <h3 >Task List: ({{ visibleTasks.length }})</h3>
            </div>
            <div class="task-list" >
              <a-card
                v-for="task in visibleTasks" 
                :key="task.id"
                class="task-card"
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
              ref ="tourStep2"
              type="primary"
              :class="{ active: currentView === 'mail' }"
              @click="currentView = 'mail'"
            >
              <template #icon><MailOutlined /></template>
              Mail Box
              <a-badge :count="emailStore.unreadCount" />
            </a-button>

            <a-button
              ref ="tourStep3"
              type="primary"
              :class="{ active: currentView === 'kanban' }"
              @click="currentView = 'kanban'"
            >
              <template #icon><AppstoreOutlined /></template>
              Kanban
            </a-button>

            <a-button
              ref = 'tourStep4'
              type="primary"
              :class="{ active: currentView === 'calendar' }"
              @click="currentView = 'calendar'"
            >
              <template #icon><CalendarOutlined /></template>
              calendar
            </a-button>
          </a-button-group>
          
          <a-button 
            ref = 'tourStep5'
            :style="{ backgroundColor: uiStore.nextDayBtnCanUse ? 'blue' : 'gray', color: 'white' }"
            :disabled="!uiStore.nextDayBtnCanUse"
            type="primary" 
            @click="advanceDay"
          >
            Next Day
          </a-button>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
  <a-tour v-model:current="tourStep" :open="rootStore.openTour" :steps="steps" @close="rootStore.handleTour(false)" />

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