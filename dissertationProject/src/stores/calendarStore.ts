import { defineStore } from 'pinia';
import type { CalendarEvent, Email, GameEventAction, ScriptStep } from '@/types';
import { useEmailStore } from '@/stores/emailStore';
import meetings from '@/data/meetings';
import { useEventStore } from './eventStore';
import { GAME_EVENTS } from '@/data/events';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentDay: 0,
    events: [] as CalendarEvent[],
    meetingCanUse: [] as CalendarEvent[],
    inMeeting: false,
    activeMeeting: null as CalendarEvent | null,
    meetingStep: 0,
    effectQueue: [] as GameEventAction[],
    meetingHistory: [] as string[],
    userChoices: [] as string[],
    
  }),

  actions: {
    resetClickedEvents() {
      this.events.forEach(t => t.completed = false);
    },

    setCurrentDay(day: number) {
      this.currentDay = day;
    },

    addMeetingCanUse(meetingId: string, meetingtype: CalendarEvent[]) {
      const addMeeting = meetingtype.find(t => t.id == meetingId);
      if (addMeeting) {
        this.meetingCanUse.push({ ...addMeeting, day: 0 });
      } 
    },

    removeMeetingCanUse(meetingId: CalendarEvent) {
      this.meetingCanUse = this.meetingCanUse.filter(t => t!=meetingId);
    },

    advanceDay(days: number = 1) {
      //TODO A LOT



      this.currentDay += days;
      this.scheduleMeeting(meetings.dailyMeeting([],[]),this.currentDay)
    },

    scheduleMeeting(event: Omit<CalendarEvent, 'completed' | 'day'>, day: number) {
      this.events.push({
        ...event,
        day: day,
        completed: false
      });
    },

    removeMeeting(meetingId: string) {
      const thisMeeting = this.events.find(e => e.id == meetingId)
      if(thisMeeting){
        this.meetingCanUse.push({...thisMeeting,day:0})
      }
      this.events = this.events.filter(e => e.id !== meetingId);
      if (this.activeMeeting?.id === meetingId) {
        this.resetMeetingState();
        this.inMeeting = false;
      }
    },

    startMeeting(meetingId: string) {
      const meeting = this.events.find(e => e.id === meetingId);
      if (meeting) {
        this.activeMeeting = { ...meeting };
        this.meetingStep = 0;
        this.effectQueue = [];
        this.meetingHistory = [];
        this.userChoices = [];
        this.inMeeting = true;
      }
    },

    proceedMeeting() {
      if (!this.activeMeeting?.scripts) return;
      const currentStep = this.activeMeeting.scripts[this.meetingStep];
      this.meetingHistory.push(currentStep.sys);
    },

    selectOption(effects: GameEventAction[] = [], text?: string) {
      this.effectQueue.push(...effects);
      this.userChoices.push(text || '');
      this.meetingStep++;
      
      if (this.meetingStep >= (this.activeMeeting?.scripts?.length || 0)) {
        this.completeMeeting();
      } else {
        this.proceedMeeting();
      }
    },

    async completeMeeting() {
      this.inMeeting = false;
      const emailStore = useEmailStore();

      try {
        for (const effect of this.effectQueue) {
          await this.applyMeetingEffect(effect);
        }

        if (this.activeMeeting) {
          emailStore.addEmail(this.generateMeetingEmail());
        }
        if(this.activeMeeting?.finishEventId){
          useEventStore().triggerEvent(this.activeMeeting.finishEventId,GAME_EVENTS)
        }
      } finally {
        if (this.activeMeeting) {
          this.activeMeeting.completed = true;
          this.events = this.events.map(e => 
            e.id === this.activeMeeting?.id ? this.activeMeeting : e
          );
        }
        this.resetMeetingState();
      }
    },

    applyMeetingEffect(effect: GameEventAction) {
      console.log('Applying effect:', effect);
      // 具体效果实现逻辑
    },

// 保持之前的所有方法不变，仅修改completeMeeting方法中的邮件生成
generateMeetingEmail(): Omit<Email, 'id' | 'isRead'> {
  if (!this.activeMeeting) {
    throw new Error('No active meeting to generate email');
  }

  const combinedLogs = this.meetingHistory.flatMap((sysLog, index) => [
    `System: ${sysLog}`,
    ...(this.userChoices[index] ? [`User: ${this.userChoices[index]}`] : [])
  ]);

  return {
    from: 'system@company.com',
    to: ['user@company.com'],
    subject: `[Meeting Record] ${this.activeMeeting.title}`,
    content: `
      Meeting Title: ${this.activeMeeting.title}
      Date: Day ${this.currentDay}
      -------------------------------
      Full Logs:
      ${combinedLogs.join('\n      ')}
      
      Decisions:
      ${this.effectQueue.map(e => `• ${e.type}`).join('\n')}
    `,
    day:this.currentDay,
    metadata: {
      requiresAction: false,
      category: 'system'
    }
  };
},

    resetMeetingState() {
      this.activeMeeting = null;
      this.meetingStep = 0;
      this.effectQueue = [];
      this.meetingHistory = [];
      this.userChoices = [];
    }
  },

  getters: {
    todaysMeetings: (state) => state.events.filter(
      e => e.day === state.currentDay
    ),

    upcomingMeetings: (state) => state.events.filter(
      e => e.day > state.currentDay && e.day <= state.currentDay + 3
    ),

    currentScriptStep(): ScriptStep | null {
      if (!this.activeMeeting?.scripts) return null;
      return this.activeMeeting.scripts[this.meetingStep];
    }
  },
  
  persist: true
});