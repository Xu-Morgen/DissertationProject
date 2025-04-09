import type { CalendarEvent, Task } from '@/types';
import contacts from './contacts';

const MEETING_TEMPLATES: CalendarEvent[] = [{
  id: 'daily_standup',
  title: '每日站会',
  day: 0,
  type: 'daily',
  participants: contacts.CONTACTS['team'],
  canDelete:true,
  completed: false,
  scripts: [
    {
      sys: "团队每日站会开始，请选择要进行的操作：",
      options: [
        { 
          text: "正常进行任务汇报",
          effects: [
            { type: 'advance_day', days: 1 },
            { type: 'add_task', taskId: 'daily_report' }
          ]
        },
        {
          text: "缩短会议时间",
          effects: [
            { type: 'advance_day', days: 1 },
            { type: 'modify_satisfaction', value: -5 }
          ]
        }
      ]
    },
    {
      sys: "请总结今日计划：",
      options: [
        {
          text: "明确三个主要任务",
          effects: [
            { type: 'unlock_feature', feature: 'task_prioritization' }
          ]
        }
      ]
    }
  ]
}];

const CLIENT_MEETINGS: CalendarEvent[] = [{
  id: 'sprint_review',
  type: 'client',
  title: 'Sprint评审会议',
  canDelete:true,
  day: 7,
  participants: contacts.CONTACTS['team'],
  completed: false,
  scripts: [
    {
      sys: "欢迎参加Sprint评审，请展示已完成的功能：",
      options: [
        {
          text: "展示登录模块",
          effects: [
            { type: 'modify_satisfaction', value: 10 },
            { type: 'finish_task', taskId: 'login_module' }
          ]
        }
      ]
    }
  ]
}];

/** 新人会议模板 */
const FRESH_MEETINGS: CalendarEvent[] = [{
  id: 'fresher_meeting',
  type: 'client',
  title: 'Orientation party',
  day: 0,
  participants: contacts.CONTACTS['client'],
  completed: false,
  finishEventId: "finish_first_meeting",
  scripts: [
    {
      sys: "Welcome to our team",
      options: [
        {
          text: "Hello everyone ",
        }
      ]
    },
    {
      sys: "Theoretically I should explain some background of the game now, but I am lazy, so I will write it later."
    },
    {
      sys: "So the meeting ends here.",
      options: [
        {
          text: "goodbye",
        }
      ]
    }
  ],
  canDelete: true,
}];

const dailyMeeting = (tasks:Task[],meetings:CalendarEvent[]):CalendarEvent =>{
    const returnMeeting:CalendarEvent = {
      id: 'daily meeting',
      type: 'daily',
      title: '每日会议',
      canDelete:true,
      day: 7,
      participants: contacts.CONTACTS['team'],
      completed: false,
      scripts: [
        {
          sys: `昨日完成内容,${tasks[0].id}`,
          options: [
            {
              text: "我已知晓",
              effects: [
                { type: 'modify_satisfaction', value: 10 },
                { type: 'finish_task', taskId: 'login_module' }
              ]
            }
          ]
        }
      ]
    }
    return returnMeeting
  }


export default { MEETING_TEMPLATES, CLIENT_MEETINGS,FRESH_MEETINGS,dailyMeeting};