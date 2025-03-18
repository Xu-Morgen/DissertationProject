// stores/uiStore.ts
import { defineStore } from 'pinia';
import type { UIState } from '@/types';
import { useEmailStore } from '.';

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    activeView: 'mail',

    configModalOpen:false,

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
    toggleConfig(state:boolean){
      this.configModalOpen = state
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
});