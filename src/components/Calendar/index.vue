<template>
  <div class="calendar-container">
    <div class="debug-controls">
      <!-- <a-button @click="changeDay(-1)">
        <left-outlined /> Previous Day
      </a-button> -->
      <span class="current-day-label">
        Current Day: {{ calendarStore.currentDay }}
      </span>
      <!-- <a-button @click="changeDay(1)">
        <right-outlined /> Next Day
      </a-button>
      <a-button @click="resetClickedEvents" type="dashed">
        <reload-outlined /> Reset Events
      </a-button> -->
    </div>

    <div class="calendar-content">
      <div class="calendar-grid">
        <div
          v-for="day in visibleDays"
          :key="day.number"
          class="day-box"
          :class="{ 'current-day': day.number === calendarStore.currentDay }"
        >
          <div class="day-header">
            <span>Day {{ day.number }}</span>

          </div>

          <div class="events">
            <div 
      v-for="event in day.events" 
      :key="event.id"
      class="event"
      :class="getEventClass(event)"
      @click="!event.completed && handleEventClick(event)"
    >
      <div class="event-header">
        <span class="event-title">{{ event.title }}</span>
        <a-popconfirm
          v-if="!event.completed && event.canDelete && event.day >= calendarStore.currentDay"
          title="are you sure for deleting this meeting？"
          @confirm="deleteMeeting(event.id)"
        >
          <close-outlined class="delete-icon" @click.stop />
        </a-popconfirm>
      </div>
      <div class="event-meta">
        <a-tag :color="eventStatusColor(event)">
          {{ eventStatus(event) }}
        </a-tag>
        <check-outlined v-if="event.completed" class="completed-icon" />
      </div>
    </div>
          </div>
        </div>
      </div>

      <div class="meeting-area" :class="{ active: calendarStore.inMeeting }">
        <div v-if="calendarStore.inMeeting" class="meeting-container">
          <div class="meeting-header">
            <h3>{{ calendarStore.activeMeeting?.title }}</h3>
            <a-tag :color="meetingTagColor">
              {{ meetingStatusText }}
            </a-tag>
          </div>

          <div class="meeting-content">
            <div class="script-flow" ref="scriptFlow">
              <div 
                v-for="(log, index) in combinedHistory"
                :key="index"
                :class="['log-item', log.type]"
              >
                <div class="log-bubble">
                  <component 
                    :is="log.type === 'sys' ? TeamOutlined : UserOutlined"
                    class="log-icon"
                  />
                  <span class="log-text">{{ log.text }}</span>
                </div>
              </div>
            </div>

            <div v-if="currentOptions.length > 0" class="player-options">
              <a-button 
                v-for="(option, idx) in currentOptions"
                :key="idx"
                @click="handleOptionSelect(option)"
                class="option-button"
                type="primary"
              >
                {{ option.text }}
              </a-button>
            </div>
          </div>
        </div>

        <div v-else class="waiting-meeting">
          <clock-circle-outlined class="waiting-icon" />
          <p>No active meeting - Click a meeting event to start</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { 
  LeftOutlined, 
  RightOutlined, 
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
import { useCalendarStore, useTaskStore } from '@/stores';
import type { CalendarEvent, ScriptStep } from '@/types';

const calendarStore = useCalendarStore();
const taskStore = useTaskStore();
const scriptFlow = ref<HTMLElement>();

const scrollToBottom = () => {
  nextTick(() => {
    if (scriptFlow.value) {
      scriptFlow.value.scrollTop = scriptFlow.value.scrollHeight;
    }
  });
};

const visibleDays = computed(() => {
  const start = Math.max(calendarStore.currentDay - 3, 0);
  const end = calendarStore.currentDay + 3;
  return Array.from({ length: end - start + 1 }).map((_, i) => ({
    number: start + i,
    events: calendarStore.events.filter(e => e.day === start + i)
  }));
});

const combinedHistory = computed(() => {
  const history = calendarStore.meetingHistory.flatMap((sysLog, index) => {
    const userChoice = calendarStore.userChoices[index];
    return [
      { type: 'sys', text: sysLog },
      ...(userChoice ? [{ type: 'user', text: userChoice }] : [])
    ];
  });
  scrollToBottom();
  return history;
});

const currentOptions = computed(() => {
  if (!calendarStore.currentScriptStep) return [];
  return calendarStore.currentScriptStep.options || [{
    text: calendarStore.meetingStep === (calendarStore.activeMeeting?.scripts?.length || 0) - 1 
      ? "Finish Meeting" 
      : "Continue",
    effects: []
  }];
});

const changeDay = (delta: number) => {
  const newDay = calendarStore.currentDay + delta;
  if (newDay < 1) return;
  calendarStore.setCurrentDay(newDay);
};

const resetClickedEvents = () => {
  calendarStore.resetClickedEvents();
};



const getEventClass = (event: CalendarEvent) => ({
  'event-completed': event.completed,
  'event-active': calendarStore.activeMeeting?.id === event.id,
  'event-disabled': event.day !== calendarStore.currentDay // 新增禁用样式
});

const eventStatus = (event: CalendarEvent) => {
  if (event.completed) return 'Completed';
  if (event.day < calendarStore.currentDay) return 'Expired';
  return 'Scheduled';
};

const eventStatusColor = (event: CalendarEvent) => {
  if (event.completed) return '#52c41a';
  if (event.day < calendarStore.currentDay) return '#ff4d4f';
  return '#1890ff';
};

const handleEventClick = (event: CalendarEvent) => {
  if (event.completed) return;
  if (event.day !== calendarStore.currentDay) return;
  if (calendarStore.inMeeting && calendarStore.activeMeeting?.id !== event.id) {
    alert('please finish current meeting');
    return;
  }
  if (event.scripts) {
    calendarStore.startMeeting(event.id);
    if (!event.completed) {
      calendarStore.proceedMeeting();
    }
  }
};


  const handleOptionSelect = (option: ScriptStep['options'][number]) => {
    calendarStore.selectOption(option.effects, option.text);
  };

const deleteMeeting = (meetingId: string) => {
  const meeting = calendarStore.events.find(t=>t.id == meetingId)
  if(meeting?.day){
    if(meeting?.day <= calendarStore.currentDay){
      calendarStore.removeMeeting(meetingId);
    } 
  }


};

const meetingTagColor = computed(() => 
  calendarStore.activeMeeting?.completed ? '#52c41a' : '#1890ff'
);

const meetingStatusText = computed(() =>
  calendarStore.activeMeeting?.completed ? 'Completed' : 'In Progress'
);

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped lang="less">
.calendar-container {
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .debug-controls {
    margin-bottom: 20px;
    padding: 16px;
    background: #fffbe6;
    border-radius: 8px;
    display: flex;
    gap: 16px;
    align-items: center;

    .current-day-label {
      font-weight: 500;
      color: #1890ff;
    }
  }

  .calendar-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 25vh);
  }

  .calendar-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    overflow-y: auto;
    padding-right: 8px;
    margin-bottom: 16px;

    .day-box {
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      &.current-day {
        border: 2px solid #1890ff;
      }

      .day-header {
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .events {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .event {
          transition: all 0.3s;
          padding: 12px;
          border-radius: 8px;
          background: #f8f8f8;
          cursor: pointer;

          &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .delete-icon {
            color: #ff4d4f;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }

          .completed-icon {
            color: #52c41a;
            margin-left: 8px;
          }

          &:hover {
            transform: translateY(-2px);
          }

          &.event-completed {
            opacity: 0.7;
            border-left: 3px solid #52c41a;
            .event-title {
              text-decoration: line-through;
            }
          }

          &.event-active {
            box-shadow: 0 0 0 2px #1890ff;
          }
        }
      }
    }
  }

  .meeting-area {
  height: 300px;
  transform: none;
  transition: all 0.3s;
  border: 2px dashed #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  background: #f0f5ff;
    &.active {
      border-color: #1890ff;
      background: #f0f5ff;
    }

    .meeting-container {
      height: 100%;
      display: flex;
      flex-direction: column;

      .meeting-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }

      .meeting-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .script-flow {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          background: white;
          border-radius: 4px;
          margin-bottom: 16px;

          .log-item {
            margin: 8px 0;

            &.user {
              text-align: right;
            }

            .log-bubble {
              display: inline-flex;
              align-items: center;
              padding: 8px 12px;
              border-radius: 15px;
              max-width: 80%;

              .sys & {
                background: #f0f2f5;
              }

              .user & {
                background: #1890ff;
                color: white;
              }

              .log-icon {
                margin-right: 8px;
              }
            }
          }
        }

        .player-options {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, 1fr);

          .option-button {
            white-space: normal;
            height: auto;
          }
        }
      }
    }

    .waiting-meeting {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;

      .waiting-icon {
        font-size: 48px;
        color: #1890ff;
        margin-bottom: 16px;
      }

      p {
        margin: 0;
        font-size: 16px;
      }
    }
  }
}
.event-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>