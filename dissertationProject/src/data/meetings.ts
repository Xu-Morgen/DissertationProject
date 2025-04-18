import type { CalendarEvent, Task,MeetingType, ScriptStep } from '@/types';
import contacts from './contacts';
import { effect } from 'vue';

export const MEETING_TEMPLATES = {
  tech_emergency: {
    id: "tech_emergency",
    type: 'client',
    title: "tech emergency meeting",
    participants: {  // 添加缺失的participants属性
      id: "tech_team",
      name: "tech team",
      isEmergency:true
    },
    scripts: [
      {
        sys: "CTO：how is everything going on？",
        options: [
          { 
            text: "has apply second server", 
            effects: [
              { type: 'modify_satisfaction', value: 20 }
            ]
          }
        ]
      }
    ],
    canDelete: false
  }
} satisfies Record<string, Omit<CalendarEvent, "completed" | "day">>;

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
      : 'none';
  
    const progressText = progressedTasks.length > 0
      ? progressedTasks.map(task => `【${task.title}】：${task.progress}%`).join('，')
      : 'no progress';
  
    const scripts: CalendarEvent['scripts'] = [
      {
        sys: `yesterday finish：${doneText}`,
        options: [
          {
            text: 'got it',
          }
        ]
      },
      {
        sys: `task in progress：${progressText}`,
        options: [
          {
            text: 'hurry up！',
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
      title: "system check",
      day: 3,
      completed: false,
      scripts: [
        {
          sys: "CTO：we need to check system",
          options: [
            { text: "show work" },
            { text: "ask for time" }
          ]
        }
      ],
      canDelete: false,
      type: 'daily',
      participants: {id:'client',name:'client',isEmergency:false}
    }
  ];

  const customCustomerMeeting = (params:{id:string,title:string,taskIsComplete:Task}):CalendarEvent=>{
    let scripts: ScriptStep[] = []
    if(params.taskIsComplete.status == 'done'){
      scripts = [
        {
        sys: `CTO：we need to check${params.taskIsComplete.title}`,
        options: [
          { text: "show work" },
        ]
      },
      {
        sys: `CTO：good job`,
        options: [
          { text: "thanks",effects:[{type: 'finish_personal_task',taskId:params.taskIsComplete.linkedPersonalTaskId as string}] },
        ]
      }
    ]
    }
    else{
      scripts = [
        {
        sys: `CTO：we need to check ${params.taskIsComplete.title}`,
        options: [
          { text: "ask for time" },
        ]
      },
      {
        sys: `CTO：ask for more work`,
        options: [
          { text: "we'll do better" },
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
      participants: {id:'client',name:'client',isEmergency:false},
      linkedTaskId:params.taskIsComplete.id,
    }

    return meeting


  }
  


export default { MEETING_TEMPLATES, CLIENT_MEETINGS,FRESH_MEETINGS,dailyMeeting,CUSTOMER_MEETINGS,customCustomerMeeting };