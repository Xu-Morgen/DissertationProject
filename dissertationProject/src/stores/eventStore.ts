// stores/eventStore.ts
import { defineStore } from 'pinia';
import type { GameEvent, GameEventAction } from '@/types';
import { useCalendarStore } from './calendarStore';
import { useEmailStore } from './emailStore';
import { useTaskStore } from './taskStore';
import tasks from '@/data/tasks';
import { toRaw } from 'vue';
import TaskData from '@/data/tasks'
import EmailData from '@/data/emails'

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
        // 常规动作处理...
        case 'add_email':
          const email = EmailData.SYSTEM_EMAILS.find(t=>t.id == action.templateId)
          if(email){
            emailStore.addEmail({...email})
          }
          break;
          
        case 'advance_day':
          calendarStore.advanceDay(action.days);
          break;

        case 'add_task':
          const findTask = TaskData.TASK_TEMPLATES[action.taskId]
          if(findTask){
            taskStore.upsertTask({
              ...findTask,
              id: `email_${Date.now()}`,
              createdAt: calendarStore.currentDay
            })
          }
          break
        
        case 'add_personal_task':
          const findPersonalTask = TaskData.PERSONAL_TASK.find(t=>t.id == action.taskId)
          if(findPersonalTask){
            taskStore.upsertPersoanlTask(findPersonalTask)
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
        //需验证动作处理

        case 'do_first_kanban':
          const firsttask = taskStore.backlog.find(t=>t.title == "用户分析面板")
          //验证成功
          if(firsttask?.priority == 'urgent'){
            const actions:GameEventAction[] = [
              {type:'finish_personal_task',taskId:"first_kanban_work"},
              {type:'remove_sent_format',replyId:"first_kanban"},
              {type:'add_email',templateId:"first_kanban_succeed"},
            ]
            for (const action of actions) {
              await this.executeAction(action);
            }
          }
          //验证失败
          else{
            const actions:GameEventAction[] = [
              {type:'add_email',templateId:"first_kanban_failed"},
            ]
            for (const action of actions) {
              await this.executeAction(action);
            }
          }
          break

        // 其他动作类型处理...
      }
    }
  },
  persist:true,
});