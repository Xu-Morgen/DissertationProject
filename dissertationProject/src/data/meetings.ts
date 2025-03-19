import type { CalendarEvent } from '@/types';
import contacts from './contacts';

const MEETING_TEMPLATES: CalendarEvent[] = [{
  id: 'daily_standup',
  type: 'daily',
  title: '每日站会',
  day: 0,
  participants: contacts.CONTACTS[2],
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
  day: 7,
  participants: contacts.CONTACTS[0],
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
  title: '新人会议',
  day:0,
  participants: contacts.CONTACTS[0],
  completed: false,
  scripts: [
    {
      sys: "欢迎开会欢迎开会：",
      options: [
        {
          text: "不开心不开心呢",
          effects: [

          ]
        }
      ]
    }
  ]
}];

export default { MEETING_TEMPLATES, CLIENT_MEETINGS,FRESH_MEETINGS };