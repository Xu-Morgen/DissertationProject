// stores/appStore.ts
import { defineStore } from 'pinia';
import type { Recipient } from '../types/Recipients';

interface AppState {
  workflowProgress: number;
  currentDay: number;
  recipients: Recipient[];
  meetingState: {
    isActive: boolean;
    variables: Record<string, number>;
    trackedEvents: number[];
  };
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    workflowProgress: 0,
    currentDay: 1,
    recipients: [],
    meetingState: {
      isActive: false,
      variables: {},
      trackedEvents: []
    }
  }),
  actions: {

    updateWorkflowProgress(progress: number) {
      this.workflowProgress = Math.max(0, Math.min(100, progress));
    },
    manageMeeting(active: boolean) {
      this.meetingState.isActive = active;
      if (!active) {
        this.meetingState.variables = {};
      }
    }
  },
  getters: {
    availableRecipients: (state) => 
      state.recipients.filter(r => r.isUnlocked)
  },
  persist: true
});