// stores/eventStore.ts
import { defineStore } from 'pinia';
import type { GameEvent, GameEventAction } from '@/types';
import { useCalendarStore } from './calendarStore';
import { useEmailStore } from './emailStore';
import { useTaskStore } from './taskStore';
import tasks from '@/data/tasks';
import { toRaw } from 'vue';
import TaskData from '@/data/tasks'

export const useEventStore = defineStore('events', {
  state: () => ({
    triggeredEvents: [] as string[] // 已触发的一次性事件
  }),

  actions: {
    /**
     * 触发指定事件
     */
    async triggerEvent(eventId: string,gameEvents:Record<string, GameEvent>,) {

      if (this.triggeredEvents.some(t=>t == eventId)) {
        console.log(`Event ${eventId} already triggered`);
        return;
      }

      const event = gameEvents[eventId]; // 需要从外部导入预定义事件
      if (!event) return;

      try {
        for (const action of event.actions) {
          await this.executeAction(action);
        }

        if (event.isOnce) {
          this.triggeredEvents.push(eventId);
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

        case 'add_task':
          console.log(action.type)
          console.log(action.taskId)
          break
        
        case 'add_personal_task':
          const findTask = TaskData.PERSONAL_TASK.find(t=>t.id == action.taskId)
          if(findTask){
            taskStore.upsertPersoanlTask(findTask)
          }
          break
        
        case 'finish_personal_task':
          const finishTask = taskStore.personaltTask.find(t=>t.id === action.taskId)
          if(finishTask){
            taskStore.upsertPersoanlTask({...finishTask,status:"done"})
          }
          break

        case 'finish_task':
          break

        case 'add_recipient':
          emailStore.addRecipient(action.recipientId)
          break

        case 'add_sent_format':
          emailStore.addSentFormat(action.replyId)
          break

        case 'remove_sent_format':
          console.log(123)
          console.log(action.replyId)
          emailStore.removeSentFormat(action.replyId)
          break
        // 其他动作类型处理...
      }
    }
  },
  persist:true,
});