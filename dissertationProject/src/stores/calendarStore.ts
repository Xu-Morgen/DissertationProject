// stores/calendarStore.ts
import { defineStore } from 'pinia';
import type { CalendarEvent, GameEventAction, ScriptStep } from '@/types';
import { useEventStore } from './eventStore';
import { GAME_EVENTS } from '@/data/events';

/**
 * CalendarStore 用于管理日历和会议（Meeting）的状态，
 * 包括当前天数、所有会议事件、以及会议剧本的流程推进。
 */
export const useCalendarStore = defineStore('calendar', {
  // State 部分存放所有相关状态
  state: () => ({
    // 当前游戏/日历的天数（例如：第 0 天或第 1 天，根据具体需求）
    currentDay: 0 as number,

    // 所有会议事件的数组，每个会议对象遵循 CalendarEvent 类型
    events: [] as CalendarEvent[],

    // 存储可使用的会议列表，通常用于筛选或作为备用会议模板
    meetingCanUse: [] as CalendarEvent[],

    // 会议进行状态：true 表示当前正在进行会议，false 表示没有进行会议
    inMeeting: false as boolean,

    // 当前正在进行的会议对象，符合 CalendarEvent 类型，可能为 null（表示没有激活的会议）
    activeMeeting: null as CalendarEvent | null,

    // 当前会议剧本流程的步数，表示正在执行第几步（索引）
    meetingStep: 0,

    // 累积的会议效果队列，存储所有待执行的效果（例如推进天数、修改变量等）
    effectQueue: [] as GameEventAction[],

    // 会议历史记录，用于存放会议剧本中系统消息（例如每一步的 sys 信息）
    meetingHistory: [] as string[]
  }),

  // Actions 部分定义业务逻辑方法
  actions: {

    /**
     * 重置所有事件的点击状态。
     * 遍历所有会议事件，将它们的 completed 属性设为 false。
     */
    resetClickedEvents() {
      this.events.forEach(t => t.completed = false);
    },

    /**
     * 更新当前天数。
     * @param day 新的天数值。
     */
    setCurrentDay(day: number) {
      this.currentDay = day;
    },

    /**
     * 添加一个可用的会议到 meetingCanUse 数组中。
     * 根据 meetingId 在传入的会议模板数组中查找匹配对象，并复制添加。
     * @param meetingId 会议模板的 ID。
     * @param meetingtype 会议模板数组（例如：外部数据中的会议模板）。
     */
    addMeetingCanUse(meetingId: string, meetingtype: CalendarEvent[]) {
      const addMeeting = meetingtype.find(t => t.id == meetingId);
      if (addMeeting) {
        // 复制会议对象，并设置 day 属性为 0 后加入 meetingCanUse 数组
        this.meetingCanUse.push({ ...addMeeting, day: 0 });
      }
    },

    /**
     * 从 meetingCanUse 数组中删除指定的会议。
     * @param meetingId 要删除会议的 ID。
     */
    removeMeetingCanUse(meetingId: string) {
      // 过滤出所有会议 ID 不等于传入 meetingId 的对象
      this.meetingCanUse = this.meetingCanUse.filter(t => t.id != meetingId);
    },

    /**
     * 推进当前天数（默认推进 1 天）。
     * @param days 推进的天数。
     */
    advanceDay(days: number = 1) {
      this.currentDay += days;
    },

    /**
     * 安排新的会议。
     * 将一个新的会议对象添加到 events 数组中，并自动生成一个唯一的 ID，
     * 同时设置会议的 day 和 completed 状态。
     * @param event 会议对象（不包含 id、completed 和 day 属性）。
     * @param day 指定会议安排在哪一天。
     */
    scheduleMeeting(event: Omit<CalendarEvent, 'id' | 'completed' | 'day'>, day: number) {
      this.events.push({
        ...event,
        day: day,
        id: `meeting_${Date.now()}`, // 使用当前时间戳生成唯一 ID
        completed: false
      });
    },

    // ------------------ 会议相关方法 ------------------

    /**
     * 启动会议。
     * 根据会议 ID 在 events 数组中查找对应会议对象，并将其复制到 activeMeeting，
     * 同时重置会议流程的步数、效果队列和历史记录。
     * @param meetingId 要启动会议的 ID。
     */
    startMeeting(meetingId: string) {
      const meeting = this.events.find(e => e.id === meetingId);
      if (meeting) {
        this.activeMeeting = { ...meeting };
        this.meetingStep = 0;
        this.effectQueue = [];
        this.meetingHistory = [];
      }
    },

    /**
     * 推进会议流程。
     * 如果 activeMeeting 存在且包含剧本（scripts），则获取当前剧本步骤，
     * 将其系统消息（sys）添加到 meetingHistory 中，
     */
      proceedMeeting() {
        if (!this.activeMeeting?.scripts) return;
        
        const currentStep = this.activeMeeting.scripts[this.meetingStep];
        this.meetingHistory.push(currentStep.sys); // 仅添加系统消息到历史记录，不自动推进
      },

    /**
     * 选择会议剧本中的选项。
     * 将选项的效果（effects）添加到 effectQueue 中，然后推进会议剧本步数，
     * 如果已达到剧本末尾则完成会议，否则继续推进会议流程。
     * @param effects 选项效果数组（GameEventAction 类型）。
     */
   // stores/calendarStore.ts
    selectOption(effects: GameEventAction[] = []) {
      this.effectQueue.push(...effects);
      this.meetingStep++; // 用户操作后手动推进
      
      if (this.meetingStep >= (this.activeMeeting?.scripts?.length || 0)) {
        this.completeMeeting();
      } else {
        this.proceedMeeting(); // 仅更新系统消息，不自动推进
      }
    },

    /**
     * 完成会议。
     * 首先执行 effectQueue 中所有的会议效果（例如推进天数、修改状态等），
     * 然后将 activeMeeting 标记为完成，并更新 events 数组中对应会议的状态，
     * 最后重置会议状态。
     */
    async completeMeeting() {
      this.inMeeting = false;
      if(this.activeMeeting?.finishEventId){
        console.log(this.activeMeeting?.finishEventId)
        useEventStore().triggerEvent(this.activeMeeting?.finishEventId,GAME_EVENTS)
      }
      // 执行累积的效果
      for (const effect of this.effectQueue) {
        await this.applyMeetingEffect(effect);
      }
      
      if (this.activeMeeting) {
        this.activeMeeting.completed = true;
        // 更新 events 数组中的会议对象
        this.events = this.events.map(e => 
          e.id === this.activeMeeting?.id ? this.activeMeeting : e
        );
      }
      
      this.resetMeetingState();
    },

    /**
     * 应用单个会议效果。
     * 根据传入的 effect 执行对应的效果（例如推进天数），具体实现需根据业务需求完善。
     * @param effect 会议效果（GameEventAction 类型）。
     */
    async applyMeetingEffect(effect: GameEventAction) {
      useEventStore().executeAction(effect)
      // 其它效果类型可以在这里添加处理逻辑
    },

    /**
     * 重置会议状态。
     * 将 activeMeeting 清空，将会议步骤和效果队列重置为初始值。
     */
    resetMeetingState() {
      this.activeMeeting = null;
      this.meetingStep = 0;
      this.effectQueue = [];
    }
  },

  // ---------------------- Getters ----------------------
  getters: {
    /** 返回当天的所有会议 */
    todaysMeetings: (state) => state.events.filter(
      e => e.day === state.currentDay
    ),

    /** 返回接下来 3 天内的会议 */
    upcomingMeetings: (state) => state.events.filter(
      e => e.day > state.currentDay && e.day <= state.currentDay + 3
    ),

    /**
     * 返回当前剧本步骤
     * 如果 activeMeeting 存在并且包含剧本，则返回当前 meetingStep 对应的剧本步骤，否则返回 null。
     */
    currentScriptStep(): ScriptStep | null {
      if (!this.activeMeeting?.scripts) return null;
      return this.activeMeeting.scripts[this.meetingStep];
    }
  },
  // 持久化 store 状态
  persist: true,
});
