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
    
      // ✅ Day 0 - 教学关，跳过游戏主循环
      if (this.currentDay === 0) return;
    
      // ✅ 推进 backlog（工作 + 昨日任务）
      taskStore.workingBacklog();
      this.changeCustomMeeting()

      // ✅ 记录昨日任务
      const yesterdayTasks = [...taskStore.yesterdayTask];
      taskStore.clearYesterdayTask();
    
      // ✅ Daily 会议安排 + 邮件
      this.scheduleMeeting(meetings.dailyMeeting(yesterdayTasks), this.currentDay);
    
      const todayMeetings = this.events.filter(t => t.day === this.currentDay);

    
      // ✅ 每三日生成一次客户任务 + 客户会议
      if (this.currentDay % 3 === 0) {
        const customerMeetingId = `client_meeting_${this.currentDay}`;
        const { mainTask } = taskStore.generateCustomerTask({
          meetingId: customerMeetingId,
          title: `客户提出任务 - ${this.currentDay}`,
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
    
      // ✅ 每七日安排 Sprint 总结会议
      if (this.currentDay % 7 === 0) {
        this.scheduleMeeting({
          id: `sprint_meeting_day_${this.currentDay}`,
          title: `Sprint总结会议`,
          type: 'personal',
          canDelete: true,
          scripts: this.generateSprintMeetingScript(),
          linkedTaskId: undefined,
          finishEventId: undefined,
          participants: {
            id: 'user',
            name: '你',
            isEmergency: false
          }
        }, this.currentDay);
      }
    
      // ✅ 每日生成一个紧急任务
      const emergencyTemplate = taskStore.getRandomEmergencyTemplate();
      if (emergencyTemplate) {
        taskStore.generateEmergencyTaskFrom(emergencyTemplate);
      }
      const { id, isRead, ...todayMeetingEmail } = emails.dailyEmail(todayMeetings, this.currentDay);

      mailStore.addEmail(todayMeetingEmail);
      // ✅ 胜利 / 失败判定
      this.checkVictoryOrDefeat();
    },
    
    checkVictoryOrDefeat() {
      const taskStore = useTaskStore();
      const allTasksCompleted = taskStore.backlog.every(t => t.status === 'done');
      const dayLimitReached = this.currentDay >= 21;
      const lost = taskStore.satisfaction <= 0;
    
      if (lost) {
        alert("💥 游戏失败：客户满意度过低！");
      } else if (allTasksCompleted || dayLimitReached) {
        alert("🎉 游戏胜利：你完成了所有任务或坚持到了第21天！");
      }
    },
    
    //生成sprint会议脚本
    generateSprintMeetingScript(): ScriptStep[] {
      const taskStore = useTaskStore();
      const completed = taskStore.backlog.filter(t => t.status === 'done' && t.createdAt >= this.currentDay - 7);
      const inProgress = taskStore.backlog.filter(t => t.status !== 'done' && t.createdAt >= this.currentDay - 7);
    
      return [
        {
          sys: `CTO：欢迎参加Sprint总结，以下是上周完成的任务共 ${completed.length} 项。`,
          options: [{ text: "继续" }]
        },
        {
          sys: `CTO：仍有 ${inProgress.length} 项任务未完成，请确保接下来的工作进度。`,
          options: [{ text: "明白了" }]
        },
        {
          sys: `CTO：我们将继续追踪本Sprint满意度，目前客户满意度为 ${taskStore.satisfaction}。`,
          options: [{ text: "保持努力" }]
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
                      { text: "thanks" ,effects:[{type: 'finish_personal_task',taskId:task.linkedPersonalTaskId as string}]},
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
                      { text: "we will do better" },
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