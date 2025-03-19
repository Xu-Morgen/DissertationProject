<template>
  <div class="calendar-container">
    <!-- 调试控制区域（保持不变） -->
    <div class="debug-controls">
      <a-button @click="changeDay(-1)">
        <left-outlined /> the day before
      </a-button>
      <span class="current-day-label">
        Current days: {{ calendarStore.currentDay }}
      </span>
      <a-button @click="changeDay(1)">
        <right-outlined /> the day after
      </a-button>
      <a-button @click="resetClickedEvents" type="dashed">
        <reload-outlined /> Reset click state
      </a-button>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <div
        v-for="day in visibleDays"
        :key="day.number"
        class="day-box"
        :class="{ 'current-day': day.number === calendarStore.currentDay }"
      >
        <div class="day-header">
          <span>Day: {{ day.number }}</span>
          <a-tag v-if="isSprintDay(day.number)" color="#87d068">
            Sprint {{ sprintDayNumber(day.number) }}
          </a-tag>
        </div>

        <div class="events">
          <div
            v-for="event in day.events"
            :key="event.id"
            class="event"
            :class="getEventClass(day.number, event.id)"

          >
          <a-button @click="handleEventClick(day.number, event.id)">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-meta">
              <a-tag :color="eventStatusColor(event)">
                {{ eventStatus(event) }}
              </a-tag>
              <span v-if="isEventClicked(event.id)" class="clicked-badge">
                <check-outlined />
              </span>
            </div>
          </a-button> 
          </div>
        </div>
      </div>
    </div>

      <div v-if="calendarStore.inMeeting">
        <!-- 会议室区域（直接嵌入在日历网格下方） -->
        <div v-if="calendarStore.activeMeeting" class="meeting-room">
          <div class="meeting-header">
            <h3>{{ calendarStore.activeMeeting.title }}</h3>
            <a-tag :color="meetingTagColor">
              {{ meetingStatusText }}
            </a-tag>
          </div>

          <!-- 显示会议聊天记录（剧本流程） -->
          <div class="script-flow">
            <div 
              v-for="(log, index) in calendarStore.meetingHistory" 
              :key="index"
              class="script-step"
            >
              {{ log }}
            </div>
          </div>

          <!-- 玩家选项（当前剧本步骤选项） -->
          <div v-if="currentOptions.length > 0" class="player-options">
            <a-button 
              v-for="(option, idx) in currentOptions"
              :key="idx"
              @click="handleOptionSelect(option)"
              class="option-button"
            >
              {{ option.text }}
            </a-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  useCalendarStore, 
  useTaskStore, 
  useEventStore,
  useUIStore 
} from '@/stores';
import { LeftOutlined, RightOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons-vue';
import type { ScriptStep } from '@/types';



// Store 实例
const calendarStore = useCalendarStore();
const taskStore = useTaskStore();
const eventStore = useEventStore();
const uiStore = useUIStore();

// ---------------------- 日历逻辑 ----------------------
// 当前显示的日期范围（这里显示当前天前后各3天）
const visibleDays = computed(() => {
  const start = (calendarStore.currentDay - 3 <= 0) ? 0 : calendarStore.currentDay - 3;
  const end = calendarStore.currentDay + 6;

  return Array.from({ length: end - start + 1 }).map((_, i) => ({
    number: start + i,
    events: calendarStore.events.filter(e => e.day === start + i)
  }));
});

// 判断事件是否已点击
const isEventClicked = (eventId: string) => 
  calendarStore.events.find(t=>t.id == eventId)?.completed;

// 获取事件样式
const getEventClass = (dayNumber: number, eventId: string) => ({
  'disabled-event': dayNumber !== calendarStore.currentDay,
  'clicked-event': isEventClicked(eventId),
  'clickable-event': !isEventClicked(eventId) && dayNumber === calendarStore.currentDay
});

// 事件状态与颜色
const eventStatus = (event: any) => {
  if (event.completed) return 'Complete';
  if (event.day < calendarStore.currentDay) return 'Passed';
  return 'Planed';
};
const eventStatusColor = (event: any) => {
  if (event.completed) return '#52c41a';
  if (event.day < calendarStore.currentDay) return '#ff4d4f';
  return '#1890ff';
};

// 处理事件点击：如果当天的事件且未点击，则启动会议
const handleEventClick = (dayNumber: number, eventId: string) => {
  if(calendarStore.inMeeting != true){
    calendarStore.inMeeting = true
  }else{
    alert('Please complete the current meeting first')
  }
  
  if (dayNumber !== calendarStore.currentDay || isEventClicked(eventId)) return;
  // 如果事件包含剧本，则启动会议
  const event = calendarStore.events.find(e => e.id === eventId);

  if (event && event.scripts) {
    calendarStore.startMeeting(eventId);
    calendarStore.proceedMeeting();
  }
};

// 调整天数
const changeDay = (delta: number) => {
  const newDay = calendarStore.currentDay + delta;
  if (newDay < 1) return;
  calendarStore.setCurrentDay(newDay);
};

// 重置事件点击状态
const resetClickedEvents = () => {
  calendarStore.resetClickedEvents();
};

// Sprint 相关（如果需要）
const isSprintDay = (dayNumber: number) => {
  return taskStore.currentSprint?.startDay &&
         dayNumber >= taskStore.currentSprint.startDay &&
         dayNumber <= taskStore.currentSprint.endDay;
};
const sprintDayNumber = (dayNumber: number) => {
  return dayNumber - (taskStore.currentSprint?.startDay || 0);
};

// ---------------------- 会议室逻辑 ----------------------
// 计算当前会议剧本选项：使用 store 中的 getter currentScriptStep
// 前端组件
const currentOptions = computed(() => {
  if (!calendarStore.currentScriptStep) return [];
  
  const step = calendarStore.currentScriptStep;
  const isLastStep = calendarStore.meetingStep === calendarStore.activeMeeting?.scripts.length - 1;

  // 自动生成选项逻辑
  if (step.options) return step.options;
  
  return [{
    text: isLastStep ? "完成会议" : "继续",
    effects: []
  }];
});

// 计算会议标签颜色（根据会议是否完成）
const meetingTagColor = computed(() =>{
  return calendarStore.activeMeeting?.completed ? '#52c41a' : '#1890ff'
}
);

// 会议状态文字
const meetingStatusText = computed(() =>
{  
  return calendarStore.activeMeeting?.completed ? '已完成' : '进行中'}

);

// 处理玩家选项选择
const handleOptionSelect = (option: ScriptStep['options'][number]) => {
  // 调用 store 方法处理选项效果，并推进剧本
  return calendarStore.selectOption(option.effects);
};








</script>

<style scoped lang="less">
.calendar-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.debug-controls {
  margin-bottom: 20px;
  padding: 10px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  display: flex;
  gap: 15px;
  align-items: center;

  .current-day-label {
    font-weight: bold;
    color: #1890ff;
    margin: 0 16px;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
}

.day-box {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  min-height: 150px;

  &.current-day {
    border-color: #1890ff;
    background: #e6f7ff;
  }

  .day-header {
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .events {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

/* 会议室样式 */
.meeting-room {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .meeting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .script-flow {
    max-height: 300px;
    overflow-y: auto;
    padding: 12px;
    background: white;
    border-radius: 4px;

    .script-step {
      padding: 8px;
      margin: 8px 0;
      background: #f8f8f8;
      border-radius: 4px;
    }
  }

  .player-options {
    margin: 16px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .option-button {
      white-space: normal;
      height: auto;
      padding: 8px;
    }
  }

  .meeting-controls {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

/* 侧边栏任务面板样式 */
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

/* 底部导航 */
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
</style>
