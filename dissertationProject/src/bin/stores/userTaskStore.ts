// stores/userTasksStore.ts
import { defineStore } from 'pinia';
import { TaskType, type PersonalTask } from '../types/taskType';

interface UserTasksState {
  personalTasks: PersonalTask[];
  completedTaskIds: number[];
}

export const useUserTasksStore = defineStore('userTasks', {
  state: (): UserTasksState => ({
    personalTasks: [],
    completedTaskIds: []
  }),
  actions: {
    addPersonalTask(task: Omit<PersonalTask, 'id' | 'status'>) {
      const newTask: PersonalTask = {
        ...task,
        id: Date.now(),
        status: 'pending',
        type: TaskType.PERSONAL
      };
      this.personalTasks.push(newTask);
    },
    updateTaskStatus(taskId: number, status: PersonalTask['status']) {
      const task = this.personalTasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        if (status === 'completed') {
          this.completedTaskIds.push(taskId);
        }
      }
    }
  },
  getters: {
    pendingPersonalTasks: (state) => 
      state.personalTasks.filter(t => t.status === 'pending'),
    activePersonalTasks: (state) =>
      state.personalTasks.filter(t => t.status === 'in-progress')
  },
  persist: true
});