// src/data/events.ts
import type { GameEvent } from '@/types';

/** 游戏事件配置 */
export const GAME_EVENTS: Record<string, GameEvent> = {
  first_reply_message:{
    id: 'first_reply_message',
    trigger: 'email_reply:accept',
    actions: [
      {type:'add_personal_task',taskId:'first_reply'},
      {type:'finish_personal_task',taskId:"first_email"},
      {type:'add_recipient',recipientId:"boss"},
      {type:'add_sent_format',replyId:"first_reply"}
    ]
  },

  start_first_sprint: {
    id: 'start_first_sprint',
    trigger: 'email_reply:accept',  // 邮件回复accept时触发
    actions: [
      { type: 'add_task', taskId: 'sprint_plan' },
      { type: 'advance_day', days: 1 }
    ],
    isOnce: true
  },


  add_analytics_task: {
    id: 'add_analytics_task',
    trigger: 'email_reply:agree',
    actions: [
      { type: 'add_task', taskId: 'analytics' },
      { type: 'modify_satisfaction', value: +5 }
    ]
  }
};