// stores/taskStore.ts
import { defineStore } from 'pinia';
import type { Task, Sprint } from '@/types';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    backlog: [] as Task[],
    currentSprint: null as Sprint | null,
    sprintHistory: [] as Sprint[],
    satisfaction: 100 // 客户满意度（0-100）
  }),

  actions: {
    /**
     * 添加或更新任务
     */
    upsertTask(task: Task) {
      const index = this.backlog.findIndex(t => t.id === task.id);
      if (index >= 0) {
        this.backlog.splice(index, 1, task);
      } else {
        this.backlog.push(task);
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
  }
});