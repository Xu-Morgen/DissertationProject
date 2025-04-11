import type { CalendarEvent, Task,MeetingType } from '@/types';
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





  const dailyMeeting = (
    tasks: { id: string; title: string; status: string; progress: number }[]
  ): CalendarEvent => {
    const doneTasks = tasks.filter(task => task.status === 'done');
    const progressedTasks = tasks.filter(task => task.status !== 'done' && task.progress > 0);
  
    const doneText = doneTasks.length > 0
      ? doneTasks.map(task => `【${task.title}】`).join('、')
      : '无';
  
    const progressText = progressedTasks.length > 0
      ? progressedTasks.map(task => `【${task.title}】：${task.progress}%`).join('，')
      : '暂无明显进展';
  
    const scripts: CalendarEvent['scripts'] = [
      {
        sys: `昨日完成任务：${doneText}`,
        options: [
          {
            text: '收到',
          }
        ]
      },
      {
        sys: `进展中的任务：${progressText}`,
        options: [
          {
            text: '继续努力！',
          }
        ]
      }
    ];
  
    const returnMeeting: CalendarEvent = {
      id: 'daily_meeting_' + Date.now(),
      type: 'daily',
      title: '每日会议',
      canDelete: true,
      day: 7,
      participants: contacts.CONTACTS['team'],
      completed: false,
      scripts
    };
  
    return returnMeeting;
  };
  
  export const CUSTOMER_MEETINGS: CalendarEvent[] = [
    {
      id: "customer_review",
      title: "支付系统安全升级评审",
      day: 3,
      completed: false,
      scripts: [
        {
          sys: "CTO：我们需要验证支付系统的安全升级进度",
          options: [
            { text: "展示已完成工作" },
            { text: "请求更多时间" }
          ]
        }
      ],
      canDelete: false,
      type: 'daily',
      participants: {id:'client',name:'client'}
    }
  ];

  const customCustomerMeeting = (params:{id:string,title:string,taskIsComplete:Task}):CalendarEvent=>{
    let scripts = []
    if(params.taskIsComplete.status == 'done'){
      scripts = [
        {
        sys: `CTO：我们需要验证${params.taskIsComplete.title}进度`,
        options: [
          { text: "展示已完成工作" },
        ]
      },
      {
        sys: `CTO：干的不错，希望你们继续努力`,
        options: [
          { text: "合作愉快" },
        ]
      }
    ]
    }
    else{
      scripts = [
        {
        sys: `CTO：我们需要验证${params.taskIsComplete.title}进度`,
        options: [
          { text: "请求更多时间" },
        ]
      },
      {
        sys: `CTO：我们是否希望贵方能拿出更多成果`,
        options: [
          { text: "我们会多加努力" },
        ]
      }
    ]
    }
    
    const meeting = {
      id: params.id,
      title: params.title,
      day: 0,
      completed: false,
      scripts: scripts,
      canDelete: false,
      type: 'client' as MeetingType,
      participants: {id:'client',name:'client'},
      linkedTaskId:params.taskIsComplete.id
      
    }

    return meeting


  }
  

export default { MEETING_TEMPLATES, CLIENT_MEETINGS,FRESH_MEETINGS,dailyMeeting,CUSTOMER_MEETINGS,customCustomerMeeting };