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
import CommonUtils from '@/utils/utils';
import EmailData from '@/data/emails'
import TaskData from '@/data/tasks'
const emailStore = useEmailStore();
const taskStore = useTaskStore();
const calendarStore = useCalendarStore();
const eventStore = useEventStore();
const uiStore = useUIStore();
const rootStore = useRootStore();

const currentView = ref<'mail' | 'kanban' | 'calendar'>('mail');

const activeEmail = ref<Email | null>(null);
const forceUpdate = ref(0);

const tourStep = ref(0)
const tourStep1 = ref(null);
const tourStep2 = ref(null);
const tourStep3 = ref(null);
const tourStep4 = ref(null);
const tourStep5 = ref(null);
const tourStep6 = ref(null);




const steps: TourProps['steps'] = [
  {
    title: 'Task Panel',
    description: 'View and manage your current tasks here, track deadlines and progress',
    target: () => tourStep1.value && tourStep1.value.$el,
  },
  {
    title: 'Mail Center',
    description: 'Check unread emails and handle important client communications',
    target: () => tourStep2.value && tourStep2.value.$el,
  },
  {
    title: 'Kanban Board',
    description: 'Visualize task flow and manage work progress using kanban view',
    target: () => tourStep3.value && tourStep3.value.$el,
  },
  {
    title: 'Project Calendar',
    description: 'Check meeting schedules and project timelines',
    target: () => tourStep4.value && tourStep4.value.$el,
    
  },
  {
    title: 'Advance Day',
    description: 'Click here to advance game day after completing daily work',
    target: () => tourStep5.value && tourStep5.value.$el,
  },
  {
    title: 'Help Center',
    description: 'Click the question mark anytime to review this tutorial',
    target: () => tourStep6.value && tourStep6.value.$el,
    onFinish: () => {
      InitialTheGame()
      rootStore.handleTour(false)  
    }
  }
  
];
const playTour = () => {
    tourStep.value = 0
    rootStore.handleTour(true)

};

const InitialTheGame = () =>{
    const root = useRootStore();
    if(root.firstTimePlay){
        useEmailStore().addEmail(CommonUtils.omitEmail(EmailData.SYSTEM_EMAILS[0]))
        useTaskStore().upsertPersoanlTask(TaskData.PERSONAL_TASK[0])
    }
    root.played()
}






const visibleTasks = computed(() => {
  return taskStore.personaltTask.filter(t => 
    t.status !== 'done' 
  );
});

const advanceDay = async () => {
  eventStore.triggerEvent('daily_check', GAME_EVENTS); 
  await nextTick();
  forceUpdate.value++; 
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


const canAdvanceToday = computed(() => {
  if (calendarStore.currentDay === 0 && uiStore.nextDayBtnCanUse) return true;
  const todayMeetings = calendarStore.events.filter(e => e.day === calendarStore.currentDay && e.completed === false);
  return todayMeetings.length === 0 && uiStore.nextDayBtnCanUse;
});

const remainingMeetings = computed(() => {
  if (calendarStore.currentDay === 0) return 0;
  return calendarStore.events.filter(e => e.day === calendarStore.currentDay && e.completed === false).length;
});


</script>
<template>
  <div class="main-layout" :key="forceUpdate">
    <a-layout>
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
          Progres: {{ rootStore.progress }}%
        </span>
        <span class="day">
          Day:{{ calendarStore.currentDay }} 
        </span>
      </a-layout-header>

      <a-layout>


        <a-layout-content class="content">
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
          
          <a-tooltip
            :title="!canAdvanceToday ? `${remainingMeetings} meeting hasn't finished` : ''"
          >
            <a-button 
              ref="tourStep5"
              :style="{ backgroundColor: canAdvanceToday ? 'blue' : 'gray', color: 'white' }"
              :disabled="!canAdvanceToday"
              type="primary" 
              @click="advanceDay"
            >
              Next Day
            </a-button>
          </a-tooltip>

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
  overflow: hidden; 

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
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
    background: #f0f2f5;
    flex-grow: 1;
  }

  .sider {
    background: #fff;
    border-left: 1px solid #e8e8e8;
    padding: 16px;
    flex-shrink: 0; 
    width: 350px !important; 
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