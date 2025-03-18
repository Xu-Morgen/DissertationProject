// stores/eventStore.ts
import { defineStore } from 'pinia';
import type { GameEvent, GameEventAction } from '@/types';
import { useCalendarStore } from './calendarStore';
import { useEmailStore } from './emailStore';
import { useTaskStore } from './taskStore';

export const useEventStore = defineStore('events', {
  state: () => ({
    triggeredEvents: new Set<string>() // 已触发的一次性事件
  }),

  actions: {
    /**
     * 触发指定事件
     */
    async triggerEvent(eventId: string,gameEvents:Record<string, GameEvent>,) {
      if (this.triggeredEvents.has(eventId)) return;

      const event = gameEvents[eventId]; // 需要从外部导入预定义事件
      if (!event) return;

      try {
        for (const action of event.actions) {
          await this.executeAction(action);
        }

        if (event.isOnce) {
          this.triggeredEvents.add(eventId);
        }
      } catch (error) {
        console.error(`事件处理失败: ${eventId}`, error);
      }
    },

    /**
     * 执行单个事件动作
     */
    async executeAction(action: GameEventAction) {
      const taskStore = useTaskStore();
      const emailStore = useEmailStore();
      const calendarStore = useCalendarStore();

      switch (action.type) {
        case 'add_email':
          // 需要实现邮件模板查找逻辑
          break;
          
        case 'advance_day':
          calendarStore.advanceDay(action.days);
          break;

        // 其他动作类型处理...
      }
    }
  },
  persist:true,
});