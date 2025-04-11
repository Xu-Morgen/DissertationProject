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

    emailFilter: {
      unreadOnly: false,
      category: undefined
    },
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
    /** 过滤后的邮件列表 */
    filteredEmails: (state) => {
      const emailStore = useEmailStore();
      return emailStore.inbox.filter(email => {
        const categoryMatch = state.emailFilter.category 
          ? email.metadata.category === state.emailFilter.category
          : true;
        const unreadMatch = state.emailFilter.unreadOnly 
          ? !email.isRead 
          : true;
        return categoryMatch && unreadMatch;
      });
    }
  },
  persist:true,
},


);