<template>
  <div class="calendar">
    <!-- 在调试按钮区域添加重置按钮 -->
    <div class="debug-controls">
      <a-button @click="changeDay(-1)">berfore</a-button>
      <span class="current-day-label">now: {{ store.currentDay }} </span>
      <a-button @click="changeDay(1)">past</a-button>
      <a-button @click="store.resetClickedEvents()" type="dashed">
        reset click state
      </a-button>
    </div>

    <!-- 修改事件元素 -->
    <div v-for="day in days" :key="day.number" 
         class="day-box"
         :class="{ 'current-day': day.number === store.currentDay }">
      <div class="day-header">Day {{ day.number }}</div>
      <div class="events">
        <div
          v-for="(event, index) in day.events"
          :key="index"
          class="event"
          :class="getEventClass(day.number, event.id)"
          @click="handleEventClick(day.number, event.id)"
        >
          {{ event.title }}
          <span v-if="isEventClicked(event.id)" class="clicked-badge">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../../../stores/global';

const store = useGlobalStore();
const router = useRouter();

  // 定义事件和日子的接口
  interface EventItem {
    id: number;
    title: string;
  }
  
  interface Day {
    number: number;
    events: EventItem[];
  }
  
  // 初始化30天数据，每天默认一个事件（你可以根据需要调整）
  const days = ref<Day[]>([]);
  for (let i = 1; i <= 30; i++) {
    days.value.push({
      number: i,
      events: [
        { id: i, title: `Event for Day ${i}` },
        {id:300,title:"test"}
      ]
    });
  }

  // 新增方法
  const isEventClicked = (eventId: number) => {
  // 改用数组的 includes 方法
  return store.clickedEvents.includes(eventId);
};

const getEventClass = (dayNumber: number, eventId: number) => {
  return {
    'disabled-event': dayNumber !== store.currentDay,
    'clicked-event': isEventClicked(eventId),
    'clickable-event': !isEventClicked(eventId) && dayNumber === store.currentDay
  };
};

  // 事件点击处理
  const handleEventClick = (dayNumber: number, eventId: number) => {
  if (dayNumber !== store.currentDay || isEventClicked(eventId)) return;
  
  store.markEventClicked(eventId);
  const url = router.resolve({ 
    name: 'MeetingRoom',
    params: { id: eventId }
  }).href;
  store.resetMeetingState();
  window.open(url, '_blank');
};
  // 调试用天数变更
  const changeDay = (delta: number) => {
    const newDay = store.currentDay + delta;
    if (newDay < 1 || newDay > 30) return;
    store.setCurrentDay(newDay);
  };


  </script>
  
  <style scoped>

.component-container {
  flex: 1;
  min-width: 100%;
  overflow: hidden;
  padding: 16px;
  
  :deep(.ant-transfer) {
    min-width: 800px;
  }
}
.clicked-event {
  background-color: #f0f0f0 !important;
  color: #999 !important;
  cursor: not-allowed !important;
  position: relative;
}

.clicked-event::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.5);
}

.clicked-badge {
  color: #52c41a;
  margin-left: 5px;
  font-weight: bold;
}

.clickable-event {
  transition: all 0.2s;
}

.clickable-event:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.current-day {
  border: 2px solid #1890ff;
  background-color: #e6f7ff;
}

.disabled-event {
  background-color: #f5f5f5;
  color: #bfbfbf;
  cursor: not-allowed;
  pointer-events: none;
}

.debug-controls {
  margin-bottom: 20px;
  padding: 10px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  display: flex;
  gap: 15px;
  align-items: center;
}

.current-day-label {
  font-weight: bold;
  color: #1890ff;
}
  /* 使用 CSS Grid 实现从左往右、从上到下排列 */
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr); /* 每行7个方格 */
    gap: 10px;
    padding: 10px;
  }
  
  /* 每个日子的方框样式 */
  .day-box {
    border: 1px solid #ccc;
    padding: 5px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
  }
  
  /* 日子头部显示 */
  .day-header {
    font-weight: bold;
    margin-bottom: 5px;
    text-align: center;
  }
  
  /* 事件列表区域 */

/* 调整原有样式 */
.event {
  position: relative;
  padding: 8px 12px;
  transition: background-color 0.3s;
}
  
  /* 单个事件样式 */
  .event {
    background-color: #f0f0f0;
    padding: 2px 4px;
    margin-bottom: 4px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .event:hover {
    background-color: #dcdcdc;
  }
  </style>
  