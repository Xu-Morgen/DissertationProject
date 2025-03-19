// src/data/events.ts
import type { GameEvent } from '@/types';
import MeetingData from './meetings'

/** 游戏事件配置 */
export const GAME_EVENTS: Record<string, GameEvent> = {
  daily_check:{
    id:'daily_check',
    actions:[
      {type:'daily_check'}
    ]
  },


  first_reply_message:{
    id: 'first_reply_message',
    actions: [
      {type:'add_personal_task',taskId:'first_reply'},
      {type:'finish_personal_task',taskId:"first_email"},
      {type:'add_recipient',recipientId:"boss"},
      {type:'add_sent_format',replyId:"first_reply"}
    ]
  },
  finish_first_reply:{
    id: 'finish_first_reply',
    actions: [
      {type:'finish_personal_task',taskId:"first_reply"},
      {type:'remove_sent_format',replyId:"first_reply"},
      {type:'add_email',templateId:'see_kanban'}
    ]
  },
  do_first_kanban:{
    id: 'do_first_kanban',
    actions: [
      {type:'add_personal_task',taskId:'first_kanban_work'},
      {type:'add_task',taskId:'analytics'},
      {type:'add_sent_format',replyId:'first_kanban'},
      {type:'add_recipient',recipientId:'team'}
    ]
  },
  finish_firsh_kanban:{
    id:'finish_firsh_kanban',
    actions:[
      {type:'do_first_kanban'}
    ]
  },
  do_first_meeting:{
    id:'do_first_meeting',
    actions:[
      {type:'add_personal_task',taskId:'first_meeting'},
      {type:'add_sent_format',replyId:'make_meeting'},
      {type:'add_meeting_can_use',meetingFrom:MeetingData.FRESH_MEETINGS,meetingId:'fresher_meeting'}
    ]
  },
  finish_first_meeting:{
    id:'finish_first_meeting',
    actions:[
      {type:'finish_personal_task',taskId:"first_meeting"},
      {type:'remove_meeting_can_use',meetingId:'fresher_meeting'},
      {type:'add_personal_task',taskId:"first_day"},
      {type:'unlock_next_day_btn'}
    ]
  }
}
