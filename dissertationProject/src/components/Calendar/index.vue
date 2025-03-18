<template>
    <div class="calendar-container">
      <!-- 调试控制区域 -->
      <div class="debug-controls">
        <a-button @click="changeDay(-1)">
          <left-outlined /> 前一天
        </a-button>
        <span class="current-day-label">
          当前天数: {{ calendarStore.currentDay }}
        </span>
        <a-button @click="changeDay(1)">
          <right-outlined /> 后一天
        </a-button>
        <a-button @click="resetClickedEvents" type="dashed">
          <reload-outlined /> 重置点击状态
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
            <span>第 {{ day.number }} 天</span>
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
              @click="handleEventClick(day.number, event.id)"
            >
              <div class="event-title">{{ event.title }}</div>
              <div class="event-meta">
                <a-tag :color="eventStatusColor(event)">
                  {{ eventStatus(event) }}
                </a-tag>
                <span v-if="isEventClicked(event.id)" class="clicked-badge">
                  <check-outlined />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 会议详情模态框 -->
      <a-modal
        v-model:open="showEventDetail"
        :title="selectedEvent?.title"
        width="600px"
      >
        <event-detail 
          v-if="selectedEvent"
          :event="selectedEvent"
          @complete="completeEvent"
        />
      </a-modal>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { 
    useCalendarStore, 
    useTaskStore,
    useEventStore
  } from '@/stores';
  import { 
    LeftOutlined, 
    RightOutlined, 
    ReloadOutlined,
    CheckOutlined
  } from '@ant-design/icons-vue';
  import type { CalendarEvent } from '@/types';
  
  const calendarStore = useCalendarStore();
  const taskStore = useTaskStore();
  const eventStore = useEventStore();
  
  // 当前显示的日期范围
  const visibleDays = computed(() => {
    const start = calendarStore.currentDay - 3;
    const end = calendarStore.currentDay + 3;
    return Array.from({ length: end - start + 1 }).map((_, i) => ({
      number: start + i,
      events: calendarStore.events.filter(e => e.day === start + i)
    }));
  });
  
  // 事件点击状态
  const isEventClicked = (eventId: string) => 
    calendarStore.clickedEvents.includes(eventId);
  
  // 事件样式
  const getEventClass = (dayNumber: number, eventId: string) => ({
    'disabled-event': dayNumber !== calendarStore.currentDay,
    'clicked-event': isEventClicked(eventId),
    'clickable-event': !isEventClicked(eventId) && dayNumber === calendarStore.currentDay
  });
  
  // 事件状态
  const eventStatus = (event: CalendarEvent) => {
    if (event.completed) return '已完成';
    if (event.day < calendarStore.currentDay) return '已过期';
    return '计划中';
  };
  
  const eventStatusColor = (event: CalendarEvent) => {
    if (event.completed) return '#52c41a';
    if (event.day < calendarStore.currentDay) return '#ff4d4f';
    return '#1890ff';
  };
  
  // 处理事件点击
  const selectedEvent = ref<CalendarEvent | null>(null);
  const showEventDetail = ref(false);
  
  const handleEventClick = (dayNumber: number, eventId: string) => {
    if (dayNumber !== calendarStore.currentDay || isEventClicked(eventId)) return;
  
    // 标记事件为已点击
    calendarStore.markEventClicked(eventId);
  
    // 打开详情模态框
    selectedEvent.value = calendarStore.events.find(e => e.id === eventId) || null;
    showEventDetail.value = true;
  
    // 触发事件
    eventStore.triggerEvent('event_clicked', GAME_EVENTS);
  };
  
  // 完成事件
  const completeEvent = (eventId: string) => {
    calendarStore.completeEvent(eventId);
    showEventDetail = false;
  };
  
  // 调试功能
  const changeDay = (delta: number) => {
    const newDay = calendarStore.currentDay + delta;
    if (newDay < 1) return;
    calendarStore.setCurrentDay(newDay);
  };
  
  const resetClickedEvents = () => {
    calendarStore.resetClickedEvents();
  };
  
  // Sprint 相关
  const isSprintDay = (dayNumber: number) => {
    return taskStore.currentSprint?.startDay && 
      dayNumber >= taskStore.currentSprint.startDay &&
      dayNumber <= taskStore.currentSprint.endDay;
  };
  
  const sprintDayNumber = (dayNumber: number) => {
    return dayNumber - (taskStore.currentSprint?.startDay || 0) + 1;
  };
  </script>
  
  <style scoped lang="less">
  .calendar-container {
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  
  .event {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s;
  
    &.clickable-event:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  
    &.disabled-event {
      background: #f5f5f5;
      color: #bfbfbf;
      cursor: not-allowed;
      pointer-events: none;
    }
  
    &.clicked-event {
      background: #f0f0f0;
      color: #999;
      cursor: not-allowed;
    }
  
    .event-title {
      font-size: 14px;
      font-weight: 500;
    }
  
    .event-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
  
      .clicked-badge {
        color: #52c41a;
      }
    }
  }
  </style>