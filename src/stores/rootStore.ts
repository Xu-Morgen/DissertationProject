// stores/RootStore.ts
import { defineStore } from 'pinia';
import { useTaskStore } from '.';



export const useRootStore = defineStore('root', {
  state: () => ({
    firstTimePlay:true,
    openTour:false,
    isFristTour:true,
    worker:2
  }),

  actions: {
    played(){
      this.firstTimePlay = false;
    },
    handleTour(val:boolean){
      this.openTour = val;
    },
    handleFirstTour(){
      this.isFristTour = false
    },
    changeWorker(changes:number){
      this.worker += changes
    }

  },

  getters: {
    progress: () => {
      const taskStore = useTaskStore(); // 导入你的任务管理模块
      const all = taskStore.backlog;
      const totalPoints = all.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completedPoints = all
        .filter(t => t.status === 'done')
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  
      return totalPoints === 0 ? 0 : completedPoints / totalPoints;
    }
  },
  
  persist:true,
});