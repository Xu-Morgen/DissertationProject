// stores/taskStore.ts
import { defineStore } from 'pinia';
import type { Task, Sprint, PersonalTask, TaskPriority, SentFormat, Recipient } from '@/types';
import { notification } from 'ant-design-vue';
import { useRootStore } from './rootStore';
import { useCalendarStore, useEmailStore } from '.';
import { EMERGENCY_TEMPLATES } from '@/data/emergency';
import { MEETING_TEMPLATES } from '@/data/meetings';
import contacts from '@/data/contacts';
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

    // generateEmergencyTask(params: {
    //   emergencyId: string
    //   baseTaskId: string
    // }) {
    //   const baseTask = this.backlog.find(t => t.id === params.baseTaskId);
      
    //   // 严格检查deadline存在性
      
    //   if (!baseTask ) {
    //     console.log(baseTask)
    //     console.error('基准任务不存在或未设置截止日');
    //     return;
    //   }

    //   const personalTask: PersonalTask = {  
    //     id: `emergency_${Date.now()}`,
    //     title: `[emergency] ${baseTask.title}`,
    //     description: `need to solve emergency`,
    //     status: 'backlog',
    //     linkedTaskId: baseTask.id,
    //     emergencyTemplateId: params.emergencyId,
    //     createdAt: useCalendarStore().currentDay,
    //     creator: 'system' // 使用扩展后的类型
    //   };

    //   this.attachEmergencyResources(personalTask);
    //   this.upsertPersoanlTask(personalTask);
    // },

    // attachEmergencyResources(task: PersonalTask) {
      
    //   const emailStore = useEmailStore();
    //   const calendarStore = useCalendarStore();

    //   // 安全访问模板ID
    //   if (!task.emergencyTemplateId) return;
      
    //   // 类型安全的模板访问
    //   const template = EMERGENCY_TEMPLATES[task.emergencyTemplateId as keyof typeof EMERGENCY_TEMPLATES];
    //   if (!template) return;

    //   // 完整的SentFormat对象
    //   const sentFormat: SentFormat = {
    //     id: `emergency_${task.id}`,
    //     subject: template.autoGenerate.email.subject,
    //     content: template.autoGenerate.email.content,
    //     relate: contacts.CONTACTS[template.autoGenerate.email.recipients],
    //     type: 'meeting',
    //     meetingid: template.autoGenerate.meeting?.templateId,
    //     nextEventId: undefined
    //   };
    //   emailStore.addNewSentFormat(sentFormat);

    //   // 明确的类型注解
    //   emailStore.addRecipient(template.autoGenerate.email.recipients)


    //   console.error(template.autoGenerate.meeting)
    //   // 安全的会议模板访问
    //   if (template.autoGenerate.meeting) {
    //     const meetingTemplate = MEETING_TEMPLATES[
    //       template.autoGenerate.meeting.templateId as keyof typeof MEETING_TEMPLATES
    //     ];
    //     console.error(meetingTemplate)
    //     if (meetingTemplate) {
    //       calendarStore.addNewMeetingCanUse(
    //         {...meetingTemplate,day:0,completed:false}
    //       )
    //     }
    //   }
    // },
  



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