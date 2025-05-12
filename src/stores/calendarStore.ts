import { defineStore } from 'pinia';
import type { CalendarEvent, Email, GameEventAction, ScriptStep } from '@/types';
import { useEmailStore } from '@/stores/emailStore';
import meetings from '@/data/meetings';
import { useEventStore } from './eventStore';
import { GAME_EVENTS } from '@/data/events';
import { useTaskStore } from './taskStore';
import emails from '@/data/emails';
import router from '@/router';

import { Modal } from 'ant-design-vue';

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

    addNewMeetingCanUse(meetingCanUse:CalendarEvent){
      this.meetingCanUse.push(meetingCanUse)
    },
    removeMeetingCanUse(meetingId: string) {
      this.meetingCanUse = this.meetingCanUse.filter(t => t.id != meetingId);
    },

    
    advanceDay(days: number = 1) {
      const taskStore = useTaskStore();
      const mailStore = useEmailStore();
      const eventStore = useEventStore();
    
      this.currentDay += days;
    
      // Day 0 is reserved for tutorial only and skips the main game loop
      if (this.currentDay === 0) return;
    
      // Advance backlog tasks including ongoing and yesterday's tasks
      taskStore.workingBacklog();
      this.changeCustomMeeting();
    
      // Record tasks completed yesterday
      const yesterdayTasks = [...taskStore.yesterdayTask];
      taskStore.clearYesterdayTask();
    
      // Schedule daily stand-up meeting and send corresponding emails
      this.scheduleMeeting(meetings.dailyMeeting(yesterdayTasks), this.currentDay);
    
      // Every 3 days: generate a new client task and schedule a client meeting
      if (this.currentDay % 3 === 0) {
        const customerMeetingId = `client_meeting_${this.currentDay}`;
        const { mainTask } = taskStore.generateCustomerTask({
          meetingId: customerMeetingId,
          title: `Client Task - Day ${this.currentDay}`,
          dueDay: 3,
          storyPoints: 5 + Math.floor(Math.random() * 5)
        });
    
        const customerMeeting = meetings.customCustomerMeeting({
          id: customerMeetingId,
          title: mainTask.title,
          taskIsComplete: mainTask
        });
    
        this.scheduleMeeting(customerMeeting, this.currentDay + 2);
      }
    
      // Every 7 days: schedule a Sprint summary meeting
      if (this.currentDay % 7 === 0) {
        this.scheduleMeeting({
          id: `sprint_meeting_day_${this.currentDay}`,
          title: `Sprint Review Meeting`,
          type: 'personal',
          canDelete: true,
          scripts: this.generateSprintMeetingScript(),
          linkedTaskId: undefined,
          finishEventId: undefined,
          participants: {
            id: 'user',
            name: 'You',
            isEmergency: false
          }
        }, this.currentDay);
      }
    
      // Generate a random emergency task each day
      const emergencyTemplate = taskStore.getRandomEmergencyTemplate();
      if (emergencyTemplate) {
        taskStore.generateEmergencyTaskFrom(emergencyTemplate);
      }
    
      // Send the daily summary email containing all meetings for the day
      const todayMeetings = this.events.filter(t => t.day === this.currentDay);
      const { id, isRead, ...todayMeetingEmail } = emails.dailyEmail(todayMeetings, this.currentDay);
      mailStore.addEmail(todayMeetingEmail);
    
      // Check win or loss condition
      this.checkVictoryOrDefeat();
    },
    
    
    checkVictoryOrDefeat() {
      const taskStore = useTaskStore();
      const allTasksCompleted = taskStore.backlog.every(t => t.status === 'done');
      const dayLimitReached = this.currentDay >= 22;
      const lost = taskStore.satisfaction <= 0;
    
      if (lost) {
        Modal.warn({
          title: '💥 Game failure:',
          content: 'Customer satisfaction is too low!',
          onOk: () => {
            router.push('/survey');
          }
        });

      } else if (allTasksCompleted || dayLimitReached) {

        Modal.success({
          title: '🎉 Victory in the game!！',
          content: 'If you have completed all the tasks or persisted until the 21st day, click OK to go to the questionnaire page',
          onOk: () => {
            router.push('/survey');
          }
        });
        
        
      }
    },
    
    //生成sprint会议脚本
    generateSprintMeetingScript(): ScriptStep[] {
      const taskStore = useTaskStore();
      const completed = taskStore.backlog.filter(t => t.status === 'done' && t.createdAt >= this.currentDay - 7);
      const inProgress = taskStore.backlog.filter(t => t.status !== 'done' && t.createdAt >= this.currentDay - 7);
    
      return [
        {
          sys: `CTO: Welcome to the Sprint summary. Here are ${completed.length}tasks completed last week`,
          options: [{ text: "continue" }]
        },
        {
          sys: `CTO: There are still ${inProgress.length} tasks unfinished. Please ensure the progress of the following work.`,
          options: [{ text: "got it" }]
        },
        {
          sys: `CTO: We will continue to track the satisfaction of this Sprint. Currently, the customer satisfaction is ${taskStore.satisfaction}.`,
          options: [{ text: "keep" }]
        }
      ];
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
                    sys: `CTO：we need to check ${task.title}进度`,
                    options: [
                      { text: "show work" },
                    ]
                  },
                  {
                    sys: `CTO：good job`,
                    options: [
                      { text: "thanks" ,
                        effects:[
                          {type: 'finish_personal_task',taskId:task.linkedPersonalTaskId as string},
                          { type: 'change_satisfaction', value: 5 } // ✅ 新增效果

                        ]
                      },
                    ]
                  }
                ]
              }
              else {
                scripts = [
                  {
                    sys: `CTO：we need to check${task.title}`,
                    options: [
                      { text: "ask for time" },
                    ]
                  },
                  {
                    sys: `CTO：we hope to see more work`,
                    options: [
                      { text: "we will do better",
                        effects:[{ type: 'change_satisfaction', value: -8 }]
                      },
                    ]
                  }
                ]
              }
              scripts.push()
              meeting.scripts = scripts;
            
          } else {
            console.warn(`No task with taskId of ${meeting.linkedTaskId} was found.`);
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
          console.log('[Meeting End] Triggering event:', this.activeMeeting.finishEventId);

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