
import { defineStore } from 'pinia';
import type { Task, Sprint, PersonalTask, TaskPriority, SentFormat, Recipient, EmergencyTemplate, GameEvent, GameEventAction, ScriptStep, YesterdayTask } from '@/types';
import { notification } from 'ant-design-vue';
import { useRootStore } from './rootStore';
import { useCalendarStore, useEmailStore, useEventStore } from '.';

import { GAME_EVENTS } from '@/data/events';
import { EMERGENCY_TEMPLATES } from '@/data/emergency';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    backlog: [] as Task[],
    satisfaction: 20, 
    personaltTask:[] as PersonalTask[],
    yesterdayTask:[] as YesterdayTask[]
  }),

  actions: {   

    generateEmergencyTaskFrom(template: EmergencyTemplate) {
      const calendar = useCalendarStore();
      const emailStore = useEmailStore();
    
      const currentDay = calendar.currentDay;
      const eventId = `event_emergency_${template.id}`;
    
      if (template.autoGenerate?.email && template.autoGenerate?.meeting) {
        emailStore.addNewSentFormat({
          id: `emergency_format_${template.id}`,
          subject: template.autoGenerate.email.subject,
          content: template.autoGenerate.email.content,
          relate: {
            id: template.autoGenerate.email.recipients[0],
            name: template.autoGenerate.email.recipients[0],
            isEmergency: true
          },
          type: 'meeting',
          meetingid: template.autoGenerate.meeting.templateId,
          nextEventId: `event_emergency_${template.id}` 
        });
        emailStore.addRecipient(template.autoGenerate.email.recipients[0])
      }
    

      if (template.autoGenerate?.email) {
        emailStore.addEmailWithId({
          id:`emergency_${Date.now()}`,
          from: 'system',
          to: template.autoGenerate.email.recipients,
          subject: template.autoGenerate.email.subject,
          content: template.autoGenerate.email.content,
          day: currentDay,
          replies: [],
          metadata: {
            requiresAction: true,
            category: 'system',
            onOpenEventId: `event_show_task_${template.id}` 
          }
        });
      }
      const emergencyScripts: ScriptStep[] = [
        {
          sys: `CTO：We've detected an emergency: ${template.title}`,
          options: [
            { text: "We'll address it immediately." }
          ]
        },
        {
          sys: "CTO：Please update me by end of day.",
          options: [
            { text: "Understood." }
          ]
        }
      ];
      
      if (template.autoGenerate?.meeting) {
        calendar.addNewMeetingCanUse({
          id: template.autoGenerate.meeting.templateId,
          title: `[emergency] ${template.title}`,
          type: 'personal',
          canDelete: true,
          scripts: emergencyScripts,
          linkedTaskId: undefined,
          finishEventId: `event_emergency_${template.id}`,
          participants: {
            id: 'user',
            name: 'player',
            isEmergency: true
          },
          day: 0,
          completed: false
        });
      }
    

      if (template.autoGenerate?.meeting) {
        GAME_EVENTS[`event_show_task_${template.id}`] = {
          id: `event_show_task_${template.id}`,
          actions: [
            {
              type: 'add_emergency_task_personal',
              task: {
                id: `emergency_${template.id}`,
                title: `[emergency] ${template.title}`,
                description: `Handle emergency events: "${template.title}".`,
                status: 'backlog',
                linkedTaskId: undefined,
                deadline: undefined,
                creator: 'system',
                createdAt: currentDay,
                emergencyTemplateId: template.id
              }
            }
          ]
        };
      }

    
      const actions: GameEventAction[] = [];
    
      if(template.effects?.custom){
        if(template.effects.custom == 'decrease_worker_temporarily'){
          actions.push(
            {
              type:'change_worker',
              value:-1
            }
          )
        }
      }
      if (template.effects?.blockKeywords?.length) {
        actions.push({
          type: 'block_tasks_by_keyword',
          keywords: template.effects.blockKeywords
        });
      }
    


      const eventStore = useEventStore()

      const finishactions: GameEventAction[] = [];

      if (actions.length > 0) {
        eventStore.registerEvent({
          id: eventId,
          actions: actions
        });
      }

      eventStore.triggerEvent(eventId, GAME_EVENTS);
      

      if (template.effects?.blockKeywords?.length) {
        finishactions.push({
          type: 'unblock_tasks_by_keyword',
          keywords: template.effects.blockKeywords
        });
      }
      if(template.effects?.custom){
        if(template.effects.custom == 'decrease_worker_temporarily'){
          finishactions.push(
            {
              type:'change_worker',
              value:1
            }
          )
        }
      }
      if(template.effects?.boostWorker){
        finishactions.push({
          type: 'boost_worker'
        });
      }
      finishactions.push({type:'finish_personal_task',taskId:`emergency_${template.id}`})
      console.log(finishactions)
      if(finishactions.length > 0){
        eventStore.registerEvent({
          id: `event_emergency_${template.id}`,
          actions: finishactions
        });
      }
      

    },  
    


    

    checkCustomerTasks(meetingId: string): {
      completed: number;
      total: number;
      satisfactionDelta: number;
    } {
      const relatedTasks = this.backlog.filter(
        t => t.linkedMeetingId === meetingId && t.isCustomerTask
      );

      let completed = 0;
      let totalImpact = 0;

      relatedTasks.forEach(task => {
        if (task.status === 'done') {
          completed++;
          totalImpact += 5;
        } else {
          totalImpact -= 8; 
        }
      });

      const result = {
        completed,
        total: relatedTasks.length,
        satisfactionDelta: totalImpact
      };

      this.adjustSatisfaction(result.satisfactionDelta);


      return result;
    },

    
    getRandomEmergencyTemplate(): EmergencyTemplate {
      const keys = Object.keys(EMERGENCY_TEMPLATES);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      return EMERGENCY_TEMPLATES[randomKey];
    },
    

   generateCustomerTask(params: {
     meetingId: string;    
     title: string;          
     dueDay: number;        
     storyPoints: number;    
   }): { mainTask: Task; personalTask: PersonalTask } {
     const taskId = `cust_${Date.now()}`;
     const personalTaskId = `${taskId}_pt`;
     
     const mainTask: Task = {
       id: taskId,
       title: params.title,
       description: `finish ${params.title} before Day ${params.dueDay}`,
       status: 'todo',
       priority: 'none',
       progress: 0,
       storyPoints: params.storyPoints,
       dueDay: params.dueDay,
       isCustomerTask: true,
       linkedMeetingId: params.meetingId,
       linkedPersonalTaskId: personalTaskId,
       blocked: false,
       creator: 'client',
       createdAt: useCalendarStore().currentDay
     };

     const personalTask: PersonalTask = {
       id: personalTaskId,
       title: `client：${params.title}`,
       description: `finish ${params.title} before Day ${params.dueDay}`,
       status: 'backlog',
       linkedTaskId: taskId,
       deadline: params.dueDay,
       creator: 'client',
       createdAt: useCalendarStore().currentDay
     };

     this.upsertTask(mainTask);
     this.upsertPersoanlTask(personalTask);

     notification.info({
       message: 'new client task',
       description: `create【${params.title}】`,
       placement: 'bottomRight'
     });

     return { mainTask, personalTask };
   },
   workingBacklog() {
    const worker = useRootStore().worker; 
    let availableWorkers = worker;
  
    const priorityLevels: TaskPriority[] = ['urgent', 'high', 'low'];
  
    const markedMap = new Map<string, { id: string; title: string; status: 'done' | 'inProgress'; progress: number }>();
  
    const updatedTasks = this.backlog.map(task => ({ ...task }));
  
    const processTasksByPriority = (priority: TaskPriority) => {
      while (availableWorkers > 0) {
        const eligibleTasks = updatedTasks.filter(
          (task) => task.status !== 'done' && task.priority === priority && task.progress < 100 && task.blocked!=true
        );
        if (eligibleTasks.length === 0) break;
  
        const randomIndex = Math.floor(Math.random() * eligibleTasks.length);
        const target = eligibleTasks[randomIndex];
  
        const updateValue = Math.floor(Math.random() * 41) + 40; // 40~80
        const newProgress = Math.min(target.progress + updateValue, 100);
        const newStatus: 'done' | 'inProgress' = newProgress >= 100 ? 'done' : 'inProgress';
  
        const targetIndex = updatedTasks.findIndex(t => t.id === target.id);
        if (targetIndex !== -1) {
          updatedTasks[targetIndex].progress = newProgress;
          updatedTasks[targetIndex].status = newStatus;
  
          const existing = markedMap.get(target.id);
          if (!existing || newProgress > existing.progress) {
            markedMap.set(target.id, {
              id: target.id,
              title: target.title,
              status: newStatus,
              progress: newProgress,
            });
          }
  
          availableWorkers--;
        }
      }
    };
  
    for (const priority of priorityLevels) {
      if (availableWorkers <= 0) break;
      processTasksByPriority(priority);
    }
  
    this.backlog = updatedTasks;
    this.yesterdayTask = Array.from(markedMap.values()); 
  },
  

    
    clearYesterdayTask(){
      this.yesterdayTask = []
    },
    clearTasks(){
      this.backlog = []
    },
    updateTaskPriority(taskid: string,priority: TaskPriority){
      const index = this.backlog.findIndex(t => t.id === taskid);
      const task = this.backlog.find(t => t.id === taskid);
      if (index >= 0 && task) {
        this.backlog.splice(index, 1, {...task,priority:priority});
      } 
    },

    upsertTask(task: Task) {
      const index = this.backlog.findIndex(t => t.id === task.id);
      
      const isNewTask = index === -1;
      
      if (index >= 0) {
        this.backlog.splice(index, 1, task);
      } else {
        this.backlog.push(task);
      }

      if (isNewTask) {
        notification.success({
          message: 'task added',
          description: `"${task.title}" has been added to Backlog`,
          placement: 'bottomRight',
          duration: 3,
          style: {
            marginBottom: '24px',
            borderRadius: '8px'
          }
        });
      }
    },


    upsertPersoanlTask(task: PersonalTask) {
      const index = this.personaltTask.findIndex(t => t.id === task.id);
      if (index >= 0) {
        this.personaltTask.splice(index, 1, task);
      } else {  
        this.personaltTask.push(task);
      }
    },


    adjustSatisfaction(delta: number) {
      this.satisfaction = Math.max(0, Math.min(100, this.satisfaction + delta));
    },


  },

  getters: {



  },
  persist:true,
});