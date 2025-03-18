// stores/calendarStore.ts
import { defineStore } from 'pinia';
import type { CalendarEvent } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentDay: 1 as number,
    events: [] as CalendarEvent[]
  }),

  actions: {
    /**
     * 推进游戏天数
     * @param days 要推进的天数（默认为1）
     */
    advanceDay(days: number = 1) {
      this.currentDay += days;
    },

    /**
     * 安排新的会议
     */
    scheduleMeeting(event: Omit<CalendarEvent, 'id' | 'completed'>) {
      this.events.push({
        ...event,
        id: `meeting_${Date.now()}`,
        completed: false
      });
    },

    /**
     * 标记会议为已完成
     */
    completeMeeting(meetingId: string) {
      const meeting = this.events.find(m => m.id === meetingId);
      if (meeting) meeting.completed = true;
    }
  },

  getters: {
    /** 当天的会议列表 */
    todaysMeetings: (state) => state.events.filter(
      e => e.day === state.currentDay
    ),

    /** 即将到来的会议（3天内） */
    upcomingMeetings: (state) => state.events.filter(
      e => e.day > state.currentDay && e.day <= state.currentDay + 3
    )
  },
  persist:true,
});