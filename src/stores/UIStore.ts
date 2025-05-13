// stores/uiStore.ts
import { defineStore } from 'pinia';
import type { UIState } from '@/types';
import { useEmailStore } from '.';

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    activeView: 'mail',
    readingEmailModalOpen:false,
    sendingEmailModalOpen:false,
    configModalOpen:false,

    nextDayBtnCanUse:false,
    kanban: {
      visibleColumns: {
        backlog: true,
        todo: true,
        inProgress: true,
        done: true
      }
    }
  }),
  actions: {
    toggleNextDatBtn(state:boolean){
      this.nextDayBtnCanUse = state
    },
    toggleConfig(state:boolean){
      this.configModalOpen = state
    },
    toggleReading(state:boolean){
      this.readingEmailModalOpen = state
    },
    toggleSending(state:boolean){
      this.sendingEmailModalOpen = state
    },
  },
  getters: {


  },
  persist:true,
},


);