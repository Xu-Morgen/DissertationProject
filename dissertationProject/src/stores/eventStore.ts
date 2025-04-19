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
import { useUIStore } from './UIStore';
import { useRootStore } from './rootStore';

export const useEventStore = defineStore('events', {
  state: () => ({
  }),

  actions: {
    /**
     * 触发指定事件
     */
    async triggerEvent(eventId: string,gameEvents:Record<string, GameEvent>,) {


      const event = gameEvents[eventId]; // 需要从外部导入预定义事件
      if (!event) return;

      try {
        for (const action of event.actions) {
          await this.executeAction(action);
        }

      } catch (error) {
        console.error(`event failed: ${eventId}`, error);
      }
    },

    /**
     * 执行单个事件动作
     */
    async executeAction(action: GameEventAction) {
      const taskStore = useTaskStore();
      const emailStore = useEmailStore();
      const calendarStore = useCalendarStore();
      const uIStore = useUIStore();

      switch (action.type) {
        // 常规动作处理...
        case 'add_email':
          const email = EmailData.SYSTEM_EMAILS.find(t=>t.id == action.templateId)
          if(email){
            const {id,isRead,...newEmail} = email
            emailStore.addEmail(newEmail)
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

        case 'unlock_next_day_btn':
          uIStore.toggleNextDatBtn(true)
          break

        case 'add_recipient':
          emailStore.addRecipient(action.recipientId)
          break

        case 'add_sent_format':
          emailStore.addSentFormat(action.replyId)
          break

        case 'remove_sent_format':
          emailStore.removeSentFormat(action.replyId)
          break


        case 'add_meeting_can_use':
          calendarStore.addMeetingCanUse(action.meetingId,action.meetingFrom)
          break

        case 'remove_meeting_can_use':
          calendarStore.removeMeetingCanUse(action.meetingId)
          break

        case 'log_to_console':
          console.log(action.message)
          break  

        case 'add_daily_mail':
          const dailyemail = EmailData.CLIENT_EMAILS.find(t=>t.id == action.templateId)
          if(dailyemail){
            const {id,isRead,...newEmail} = dailyemail
            emailStore.addEmail(newEmail)
          }
          break
        
        
        case 'add_emergency_task_personal':
          taskStore.upsertPersoanlTask(action.task);
          break;
        
          


        //需验证动作处理
        case 'do_first_kanban':
          const firsttask = taskStore.backlog.find(t=>t.title == "User analysis panel")
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
        
        case 'daily_check':
          if(calendarStore.currentDay == 0){
            this.executeAction({type:'finish_personal_task',taskId:"first_day"})
            this.executeAction({type:'add_recipient',recipientId:'client'})
            for (const id in TaskData.TASK_TEMPLATES_AUTO) {
              const task = TaskData.TASK_TEMPLATES_AUTO[id];
              taskStore.upsertTask({
                ...task,
                id: `${id}_${Date.now()}`,
                createdAt: calendarStore.currentDay
              });
            }
            calendarStore.advanceDay()
          }
          else{
            calendarStore.advanceDay()
          }
          break
        case 'boost_worker': 
          const rootStore = useRootStore();
          rootStore.worker *= 2;
          console.log('[GameEvent] Workers boosted');
          break;
        
          
          case 'block_tasks_by_keyword': {
            const keywords = action.keywords as string[];
            const taskStore = useTaskStore();
            taskStore.backlog.forEach(task => {
              const match = keywords.some(kw =>
                task.title.toLowerCase().includes(kw) ||
                task.description?.toLowerCase().includes(kw)
              );
              if (match) {
                task.blocked = true;
              }
            });
            console.log(`[GameEvent] Tasks blocked by keywords: ${keywords.join(', ')}`);
            break;
          }
      }
    }
  },
  persist:true,
});