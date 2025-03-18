// stores/meetingStore.ts
import { defineStore } from 'pinia';
import type { 
  MeetingAgenda,
  MeetingDecision,
  MeetingParticipant 
} from '../types/meetingTypes';

interface MeetingState {
  activeMeeting: {
    id: string;
    startTime: Date;
    agenda: MeetingAgenda[];
    participants: MeetingParticipant[];
    currentAgendaIndex: number;
  } | null;
  historicalMeetings: string[];
  decisions: Record<string, MeetingDecision>;
}

export const useMeetingStore = defineStore('meeting', {
  state: (): MeetingState => ({
    activeMeeting: null,
    historicalMeetings: [],
    decisions: {}
  }),
  actions: {
    initializeMeeting(agenda: MeetingAgenda[], participants: number[]) {
      this.activeMeeting = {
        id: `meeting-${Date.now()}`,
        startTime: new Date(),
        agenda: agenda.map(a => ({
          ...a,
          status: 'pending'
        })),
        participants: participants.map(id => ({
          userId: id,
          role: 'attendee',
          prepStatus: 'not-started'
        })),
        currentAgendaIndex: 0
      };
    },
    
    advanceAgenda() {
      if (this.activeMeeting) {
        const current = this.activeMeeting.currentAgendaIndex;
        if (current < this.activeMeeting.agenda.length - 1) {
          this.activeMeeting.agenda[current].status = 'resolved';
          this.activeMeeting.currentAgendaIndex++;
          this.activeMeeting.agenda[current].status = 'discussing';
        }
      }
    },
    
    recordDecision(agendaId: string, decision: Omit<MeetingDecision, 'followUpTasks'>) {
      this.decisions[agendaId] = {
        ...decision,
        followUpTasks: [] // 初始化空任务列表
      };
    }
  },
  getters: {
    currentAgenda: (state) => {
      return state.activeMeeting?.agenda[state.activeMeeting.currentAgendaIndex];
    },
    
    participantDetails: (state) => {
      return (userId: number) => {
        return state.activeMeeting?.participants.find(p => p.userId === userId);
      };
    }
  }
});