// stores/RootStore.ts
import { defineStore } from 'pinia';



export const useRootStore = defineStore('root', {
  state: () => ({
    firstTimePlay:true,
    openTour:false,
    isFristTour:true,
    workflowProgress:0,
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

  },

  getters: {

  },
  persist:true,
});