// stores/calendarStore.ts
import { defineStore } from 'pinia';
import type { CalendarEvent, GameEventAction, ScriptStep } from '@/types';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentDay: 1 as number,
    events: [] as CalendarEvent[],
    meetingCanUse:[] as CalendarEvent[],

    // 新增会议状态
    activeMeeting: null as CalendarEvent | null,
    meetingStep: 0,
    effectQueue: [] as GameEventAction[],
    meetingHistory: [] as string[]
  }),

  actions: {

    //将所有会议设定为未进行过
    resetClickedEvents(){
      this.events.forEach(t=>t.completed = false)
    },

    //设定当前日期
    setCurrentDay(day:number){
      this.currentDay = day
    },

    /**
     * 添加可以使用的meeting
     * @param meetingId meetingId
     * @param meetingtype Meeting来源
     */
      addMeetingCanUse(meetingId:string,meetingtype:CalendarEvent[]){
        const addMeeting = meetingtype.find(t=>t.id == meetingId)
        if(addMeeting){
          this.meetingCanUse.push({...addMeeting,day:0})
        }
      },

    /**
     * 删去不再可以使用的meeting
     * @param meetingId meetingId
     */
      removeMeetingCanUse(meetingId:string){
        this.meetingCanUse = this.meetingCanUse.filter(t=>t.id == meetingId)
      },

    /**
     * 推进游戏天数
     * @param days 要推进的天数（默认为1）
     */
    advanceDay(days: number = 1) {
      this.currentDay += days;
    },

    /**
     * 安排新的会议
     */
    scheduleMeeting(event: Omit<CalendarEvent, 'id' | 'completed'|'day'>,day:number) {
      this.events.push({
        ...event,
        day:day,
        id: `meeting_${Date.now()}`,
        completed: false
      });
    },

    // 新增会议相关方法
    startMeeting(meetingId: string) {
      const meeting = this.events.find(e => e.id === meetingId);
      if (meeting) {
        this.activeMeeting = { ...meeting };
        this.meetingStep = 0;
        this.effectQueue = [];
        this.meetingHistory = [];
      }
    },

    proceedMeeting() {
      if (!this.activeMeeting?.scripts) return;
      
      const currentStep = this.activeMeeting.scripts[this.meetingStep];
      this.meetingHistory.push(currentStep.sys);
      
      if (!currentStep.options) {
        this.meetingStep++;
        if (this.meetingStep >= this.activeMeeting.scripts.length) {
          this.completeMeeting();
        }
      }
    },

    selectOption(effects: GameEventAction[] = []) {
      this.effectQueue.push(...effects);
      this.meetingStep++;
      
      if (this.meetingStep >= (this.activeMeeting?.scripts?.length || 0)) {
        this.completeMeeting();
      } else {
        this.proceedMeeting();
      }
    },

    async completeMeeting() {
      // 执行所有累积效果
      for (const effect of this.effectQueue) {
        await this.applyMeetingEffect(effect);
      }
      
      if (this.activeMeeting) {
        this.activeMeeting.completed = true;
        this.events = this.events.map(e => 
          e.id === this.activeMeeting?.id ? this.activeMeeting : e
        );
      }
      
      this.resetMeetingState();
    },

    async applyMeetingEffect(effect: GameEventAction) {
      // 这里需要实现具体效果处理逻辑
      console.log('Applying meeting effect:', effect);
      // 示例：处理推进天数
      if (effect.type === 'advance_day') {
        this.currentDay += effect.days;
      }
    },

    resetMeetingState() {
      this.activeMeeting = null;
      this.meetingStep = 0;
      this.effectQueue = [];
    }
  },

  getters: {
    /** 当天的会议列表 */
    todaysMeetings: (state) => state.events.filter(
      e => e.day === state.currentDay
    ),

    /** 即将到来的会议（3天内） */
    upcomingMeetings: (state) => state.events.filter(
      e => e.day > state.currentDay && e.day <= state.currentDay + 3
    ),
    currentScriptStep(): ScriptStep | null {
      if (!this.activeMeeting?.scripts) return null;
      return this.activeMeeting.scripts[this.meetingStep];
    }
  },
  persist:true,
});
