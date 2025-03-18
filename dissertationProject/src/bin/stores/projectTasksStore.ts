// stores/projectTasksStore.ts
import { defineStore } from 'pinia';
import { TaskType, type ProjectTask, TaskPriority } from '../types/taskType';

interface ProjectTasksState {
  projectTasks: ProjectTask[];
  kanbanBuckets: Record<TaskPriority, number[]>;
  sprintTasks: number[];
  errorTaskIds: number[];
}

export const useProjectTasksStore = defineStore('projectTasks', {
  state: (): ProjectTasksState => ({
    projectTasks: [],
    kanbanBuckets: {
      [TaskPriority.MUST]: [],
      [TaskPriority.SHOULD]: [],
      [TaskPriority.CAN]: [],
      [TaskPriority.UNASSIGNED]: []
    },
    sprintTasks: [],
    errorTaskIds: []
  }),
  actions: {
    addProjectTask(task: Omit<ProjectTask, 'id' | 'status'>) {
      const newTask: ProjectTask = {
        ...task,
        id: Date.now(),
        status: 'pending',
        type: TaskType.PROJECT,
        kanbanStatus: 'backlog'
      };
      this.projectTasks.push(newTask);
      this.updatePriorityBucket(newTask.id, newTask.priority);
    },
    updatePriorityBucket(taskId: number, newPriority: TaskPriority) {
      // 清理旧优先级
      Object.values(TaskPriority).forEach(priority => {
        this.kanbanBuckets[priority] = 
          this.kanbanBuckets[priority].filter(id => id !== taskId);
      });
      
      // 添加新优先级
      if (newPriority !== TaskPriority.UNASSIGNED) {
        this.kanbanBuckets[newPriority].push(taskId);
      }
    },
    moveToSprint(taskId: number) {
      if (!this.sprintTasks.includes(taskId)) {
        this.sprintTasks.push(taskId);
      }
    }
  },
  getters: {
    currentSprintTasks: (state) => 
      state.projectTasks.filter(t => state.sprintTasks.includes(t.id)),
    mustTasks: (state) => 
      state.kanbanBuckets[TaskPriority.MUST].map(id => 
        state.projectTasks.find(t => t.id === id))
  },
  persist: true
});