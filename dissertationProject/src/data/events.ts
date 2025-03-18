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
  finish_first_reply:{
    id: 'finish_first_reply',
    trigger: 'email_reply:send',
    actions: [
      {type:'finish_personal_task',taskId:"first_reply"},
      {type:'remove_sent_format',replyId:"first_reply"},
      {type:'add_email',templateId:'see_kanban'}
    ]
  },
  do_first_kanban:{
    id: 'do_first_kanban',
    trigger: 'email_reply:accept',
    actions: [
      {type:'add_personal_task',taskId:'first_kanban_work'},
      {type:'add_task',taskId:'analytics'},
      
    ]
  }
}
