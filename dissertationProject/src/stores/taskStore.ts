// stores/taskStore.ts
import { defineStore } from 'pinia';
import type { Task, Sprint, PersonalTask, TaskPriority } from '@/types';
import { notification } from 'ant-design-vue';
import { useRootStore } from './rootStore';
import { useCalendarStore } from '.';

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
       description: `在Day ${params.dueDay}前完成${params.title}`,
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
       title: `客户需求：${params.title}`,
       description: `需在Day ${params.dueDay}前完成客户任务：【${params.title}】`,
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
       message: '新客户任务',
       description: `已创建关联任务【${params.title}】`,
       placement: 'bottomRight'
     });

     return { mainTask, personalTask };
   },

    /**
     * 每一次工作增加的进度 
     * 同时将完成的工作添加至yesterdayTask中
     */
    workingBacklog() {
      let worker = useRootStore().worker;
      const priorityLevels: TaskPriority[] = ['urgent', 'high', 'low'];
      const markedTasks: { id: string; title: string; status: 'done' | 'inProgress'; progress: number }[] = [];
    
      // 创建 backlog 的副本用于更新
      const updatedTasks = this.backlog.map(task => ({ ...task }));
    
      // 封装处理逻辑为函数
      const processTasksByPriority = (priority: TaskPriority) => {
        const eligibleTasks = updatedTasks.filter(
          (task) => task.status !== 'done' && task.priority === priority && task.progress <= 100
        );
        console.log(eligibleTasks)
        for (let i = 0; i < 5 && worker > 0; i++) {
          const candidates = eligibleTasks.filter(task => task.progress <= 100);
          if (candidates.length === 0) break;
    
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const target = candidates[randomIndex];
    
          const updateValue = Math.floor(Math.random() * 41) + 40; // 40 ~ 80
          const updatedProgress = target.progress + updateValue;
    
          const targetIndex = updatedTasks.findIndex(t => t.id === target.id);
          if (targetIndex !== -1) {
            updatedTasks[targetIndex].progress = updatedProgress;
    
            const newStatus = updatedProgress > 100 ? 'done' : 'inProgress';
            updatedTasks[targetIndex].status = newStatus;
    
            markedTasks.push({
              id: target.id,
              title: target.title,
              status: newStatus,
              progress: updatedProgress
            });
    
            worker--;
          }
        }
      };
    
      // 按优先级顺序处理任务
      for (const priority of priorityLevels) {
        if (worker <= 0) break;
        processTasksByPriority(priority);
      }
    
      // 更新 backlog 和保存处理记录
      this.backlog = updatedTasks;
      this.yesterdayTask = markedTasks; 
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