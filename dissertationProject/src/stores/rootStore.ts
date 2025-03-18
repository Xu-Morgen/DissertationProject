// stores/RootStore.ts
import { defineStore } from 'pinia';



export const useRootStore = defineStore('root', {
  state: () => ({
    firstTimePlay:true,
    workflowProgress:0,
  }),

  actions: {
    played(){
      this.firstTimePlay = false;
    },

  },

  getters: {

  },
  persist:true,
});