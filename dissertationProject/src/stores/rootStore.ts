// stores/RootStore.ts
import { defineStore } from 'pinia';



export const useRootStore = defineStore('root', {
  state: () => ({
    firstTimePlay:true,
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