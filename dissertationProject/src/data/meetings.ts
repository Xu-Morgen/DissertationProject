// src/data/meetings.ts
import type { CalendarEvent } from '@/types';

/** 固定会议模板 */
export const MEETING_TEMPLATES: CalendarEvent[] = [{
  id: 'daily_standup',
  type: 'daily',
  title: '每日站会',
  day: 0,  // 实际使用时动态设置
  participants: ['team'],
  completed: false,
  outcome: {
    progressReport: '自动生成团队日报...'
  }
}];

/** 客户会议模板 */
export const CLIENT_MEETINGS: CalendarEvent[] = [{
  id: 'sprint_review',
  type: 'client',
  title: 'Sprint评审会议',
  day: 7,
  participants: ['client', 'boss'],
  requiredTasks: ['sprint_plan'],
  completed: false,
  outcome: {
    satisfactionChange: 20,
    unlockedTasks: ['analytics']
  }
}];