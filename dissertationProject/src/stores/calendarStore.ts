import { defineStore } from 'pinia';
import type { CalendarEvent, Email, GameEventAction, ScriptStep } from '@/types';
import { useEmailStore } from '@/stores/emailStore';
import meetings from '@/data/meetings';
import { useEventStore } from './eventStore';
import { GAME_EVENTS } from '@/data/events';
import { useTaskStore } from './taskStore';
import tasks from '@/data/tasks';
import emails from '@/data/emails';

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

    removeMeetingCanUse(meetingId: string) {
      this.meetingCanUse = this.meetingCanUse.filter(t => t.id != meetingId);
    },

    advanceDay(days: number = 1) {
      //TODO A LOT

      console.log("advacnde")
      const taskStore = useTaskStore()
      const mailStore = useEmailStore()
      this.currentDay += days;

      //汇总每日日报
      taskStore.workingBacklog()
      this.scheduleMeeting(meetings.dailyMeeting(taskStore.yesterdayTask), this.currentDay)
      taskStore.clearYesterdayTask


      //汇总每日会议
      const todayMeetings = this.events.filter(t => t.day == this.currentDay)
      const { id, isRead, ...todayMeetingEmail } = emails.dailyEmail(todayMeetings, this.currentDay)
      mailStore.addEmail(todayMeetingEmail)

      //更改当日客户会议脚本
      this.changeCustomMeeting()



    },


    /**
    * 更新当日客户会议脚本
    */
    changeCustomMeeting() {
      const todayMeetings = this.events.filter(t => t.day == this.currentDay)
      todayMeetings.forEach(meeting => {
        if (meeting.linkedTaskId) {
          // 根据 taskId 获取任务
          const task = useTaskStore().backlog.find(t => t.id == meeting.linkedTaskId);
          if (task) {

              // 如果任务已完成，则更新 meeting 的 scripts
              let scripts:ScriptStep[] = []
              if (task.status == 'done') {
                scripts = [
                  {
                    sys: `CTO：我们需要验证${task.title}进度`,
                    options: [
                      { text: "展示已完成工作" },
                    ]
                  },
                  {
                    sys: `CTO：干的不错，希望你们继续努力`,
                    options: [
                      { text: "合作愉快" ,effects:[{type: 'finish_personal_task',taskId:task.linkedPersonalTaskId as string}]},
                    ]
                  }
                ]
              }
              else {
                scripts = [
                  {
                    sys: `CTO：我们需要验证${task.title}进度`,
                    options: [
                      { text: "请求更多时间" },
                    ]
                  },
                  {
                    sys: `CTO：我们是否希望贵方能拿出更多成果`,
                    options: [
                      { text: "我们会多加努力" },
                    ]
                  }
                ]
              }
              meeting.scripts = scripts;
            
          } else {
            console.warn(`没有找到 taskId 为 ${meeting.linkedTaskId} 的任务。`);
          }
        }
      });
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
      if (thisMeeting) {
        this.meetingCanUse.push({ ...thisMeeting, day: 0 })
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
        if (this.activeMeeting?.finishEventId) {
          useEventStore().triggerEvent(this.activeMeeting.finishEventId, GAME_EVENTS)
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
      useEventStore().executeAction(effect)
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
      
    `,
        day: this.currentDay,
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