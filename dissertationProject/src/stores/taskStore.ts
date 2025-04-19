// stores/taskStore.ts
import { defineStore } from 'pinia';
import type { Task, Sprint, PersonalTask, TaskPriority, SentFormat, Recipient, EmergencyTemplate, GameEvent, GameEventAction, ScriptStep } from '@/types';
import { notification } from 'ant-design-vue';
import { useRootStore } from './rootStore';
import { useCalendarStore, useEmailStore, useEventStore } from '.';

import { GAME_EVENTS } from '@/data/events';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    backlog: [] as Task[],
    currentSprint: null as Sprint | null,
    sprintHistory: [] as Sprint[],
    satisfaction: 100, // 客户满意度（0-100）
    personaltTask:[] as PersonalTask[], //用户个人任务
    yesterdayTask:[] as unknown as {id:string,title:string,status:string,progress:number}[]
  }),

  actions: {   

    generateEmergencyTaskFrom(template: EmergencyTemplate) {
      const calendar = useCalendarStore();
      const emailStore = useEmailStore();
    
      const currentDay = calendar.currentDay;
      const eventId = `event_emergency_${template.id}`;
    
      // ✅ 添加用户可发邮件的 sentFormat（用于 MailComposer）
      if (template.autoGenerate?.email && template.autoGenerate?.meeting) {
        emailStore.addNewSentFormat({
          id: `emergency_format_${template.id}`,
          subject: template.autoGenerate.email.subject,
          content: template.autoGenerate.email.content,
          relate: {
            id: template.autoGenerate.email.recipients[0], // 确保这个 ID 在 contacts 中
            name: template.autoGenerate.email.recipients[0],
            isEmergency: true
          },
          type: 'meeting',
          meetingid: template.autoGenerate.meeting.templateId, // 👈 用户邮件中选择的会议 id
          nextEventId: `event_emergency_${template.id}` // 👈 邮件发出后触发
        });
        emailStore.addRecipient(template.autoGenerate.email.recipients[0])
      }
    
      // ✅ 添加一封引导邮件，点击打开后触发任务生成事件
      if (template.autoGenerate?.email) {
        emailStore.addEmail({
          from: 'system',
          to: template.autoGenerate.email.recipients,
          subject: template.autoGenerate.email.subject,
          content: template.autoGenerate.email.content,
          day: currentDay,
          replies: [],
          metadata: {
            requiresAction: true,
            category: 'system',
            onOpenEventId: `event_show_task_${template.id}` // 👈 点击邮件时触发添加任务
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
          title: `[紧急] ${template.title}`,
          type: 'personal',
          canDelete: true,
          scripts: emergencyScripts,
          linkedTaskId: undefined,
          finishEventId: eventId,
          participants: {
            id: 'user',
            name: '你',
            isEmergency: true
          },
          day: 0,
          completed: false
        });
      }
    
      // ✅ 任务触发事件（用户点开邮件后触发）
      GAME_EVENTS[`event_show_task_${template.id}`] = {
        id: `event_show_task_${template.id}`,
        actions: [
          {
            type: 'add_emergency_task_personal', // 👈 统一使用标准事件类型
            task: {
              id: `emergency_${template.id}_${Date.now()}`,
              title: `[紧急] ${template.title}`,
              description: `处理紧急事件：“${template.title}”。`,
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
    
      // ✅ 事件动作（如 boostWorker 或 blockKeywords）
      const actions: GameEventAction[] = [];
    
      if (template.effects?.boostWorker) {
        actions.push({ type: 'boost_worker' });
      }
    
      if (template.effects?.blockKeywords?.length) {
        actions.push({
          type: 'block_tasks_by_keyword',
          keywords: template.effects.blockKeywords
        });
      }
    
      if (actions.length > 0) {
        GAME_EVENTS[eventId] = {
          id: eventId,
          actions
        };
      }
    },
    

    /**
     * 检查客户任务完成状态（在会议中调用）
     * @param meetingId 会议ID
     */
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
          totalImpact += 5; // 每个完成的任务增加5点满意度
        } else {
          totalImpact -= 8; // 每个未完成的任务减少8点满意度
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

    
    
    /**
    * 生成客户关联任务对
    * @param params 任务参数 
    */
   generateCustomerTask(params: {
     meetingId: string;      // 关联的会议ID
     title: string;          // 任务标题
     dueDay: number;         // 截止天数
     storyPoints: number;    // 故事点数
   }): { mainTask: Task; personalTask: PersonalTask } {
     // 生成唯一ID
     const taskId = `cust_${Date.now()}`;
     const personalTaskId = `${taskId}_pt`;
     
     // 创建主任务（任务A）
     const mainTask: Task = {
       id: taskId,
       title: params.title,
       description: `finish ${params.title} before Day ${params.dueDay}`,
       status: 'todo',
       priority: 'high',
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

     // 创建关联的个人任务（任务B）
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

     // 存储任务
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
    const worker = useRootStore().worker; // ✅ 只读取，不修改
    let availableWorkers = worker;
  
    const priorityLevels: TaskPriority[] = ['urgent', 'high', 'low'];
  
    const markedMap = new Map<string, { id: string; title: string; status: 'done' | 'inProgress'; progress: number }>();
  
    const updatedTasks = this.backlog.map(task => ({ ...task }));
  
    const processTasksByPriority = (priority: TaskPriority) => {
      while (availableWorkers > 0) {
        const eligibleTasks = updatedTasks.filter(
          (task) => task.status !== 'done' && task.priority === priority && task.progress < 100
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
    this.yesterdayTask = Array.from(markedMap.values()); // ✅ 每个任务最多一条
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
    /**
     * 添加或更新任务
     */
    upsertTask(task: Task) {
      const index = this.backlog.findIndex(t => t.id === task.id);
      
      const isNewTask = index === -1;
      
      if (index >= 0) {
        this.backlog.splice(index, 1, task);
      } else {
        this.backlog.push(task);
      }
    
      // 仅在添加新任务时显示通知
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
    /**
     * 添加或更新个人任务
     */
    upsertPersoanlTask(task: PersonalTask) {
      const index = this.personaltTask.findIndex(t => t.id === task.id);
      if (index >= 0) {
        this.personaltTask.splice(index, 1, task);
      } else {  
        this.personaltTask.push(task);
      }
    },

    /**
     * 调整客户满意度
     * @param delta 变化值（正负均可）
     */
    adjustSatisfaction(delta: number) {
      this.satisfaction = Math.max(0, Math.min(100, this.satisfaction + delta));
    },

    /**
     * 开始新的Sprint
     */
    startSprint(sprint: Omit<Sprint, 'id' | 'completedPoints'>) {
      this.currentSprint = {
        ...sprint,
        id: `sprint_${Date.now()}`,
        completedPoints: 0
      };
    }
  },

  getters: {
    /** 当前Sprint的任务列表 */
    sprintTasks: (state) => state.backlog.filter(
      t => t.sprintId === state.currentSprint?.id
    ),

    /** Sprint进度百分比 */
    sprintProgress(): number {
      if (!this.currentSprint) return 0;
      const total = this.currentSprint.committedTasks
        .reduce((sum, id) => sum + (this.backlog.find(t => t.id === id)?.storyPoints || 0), 0);
      return total > 0 
        ? (this.currentSprint.completedPoints / total) * 100
        : 0;
    }
  },
  persist:true,
});