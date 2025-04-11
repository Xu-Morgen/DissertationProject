import type { CalendarEvent, Email, Reply } from '@/types';

const SYSTEM_EMAILS: Email[] = [{
  id: 'welcome',
  from: 'system',
  to: ['player'],
  subject: 'Welcome to Engineering Rescue!！',
  content: `Before everything officially starts, let me teach you a little trick`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: 'Yes,Sir',
    nextEventId: 'first_reply_message',
  }],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
},{
  id: 'see_kanban',
  from: 'boss',
  to: ['player'],
  subject: 'An urgent task entered our backlog',
  content: `Our staff has not been effectively taking tasks from kanban for too long. Please go to the kanban page and transfer new tasks to urgent.`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: 'Yes,Sir',
    nextEventId: 'do_first_kanban',
  }],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
},{
  
    id: 'first_kanban_failed',
    from: 'team',
    to: ['player'],
    subject: 'Your verification failed, please check the kanban content carefully',
    content: `Please check the kanban content carefully`,
    day: 0,
    isRead: false, 
    metadata: {
      requiresAction: false,
      category: 'system'
  }
},{
  
  id: 'first_kanban_succeed',
  from: 'team',
  to: ['player'],
  subject: 'Your verification has been successfully passed',
  content: `Now, it's time to hold an orientation meeting to introduce yourself to everyone.`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: 'Yes,Sir',
    nextEventId: 'do_first_meeting',
  }],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
},{
  
  id: 'error',
  from: 'system',
  to: ['player'],
  subject: 'there is an error',
  content: `there is an error`,
  day: 0,
  isRead: false, 
  replies: [],
  metadata: {
    requiresAction: false,
    category: 'system'
  }
},

];



 const CLIENT_EMAILS: Email[] = [{
  id: 'client_request',
  from: 'client',
  to: ['player'],
  subject: 'New feature requirements',
  content: `We hope to add a user analytics panel....`,
  day: 3,
  isRead: false, // 添加 isRead 字段
  replies: [
    {
      id: 'agree',
      text: 'Join Current Sprint',
      nextEventId: 'add_analytics_task',
    },
    {
      id: 'delay',
      text: 'Next Sprint Processing',
    }
  ],
  metadata: {
    requiresAction: true,
    category: 'client',
  },
}];

const dailyEmail = (meetings: CalendarEvent[], day: number): Email => {
  // 生成邮件内容HTML
  const generateMeetingHTML = (meeting: CalendarEvent) => {
    const status = meeting.completed ? 
      '<span style="color: #52c41a;">✓ 已完成</span>' : 
      '<span style="color: #ff4d4f;">◷ 进行中</span>';
    const scriptProgress = `进度：${meeting.completed ? '完成' : `待进行`}`

    return `
      <div ">
        <h3>${meeting.title}</h3>
          <div>类型：${meeting.type}</div>
          <div>参与方：${meeting.participants.name}</div>
          <div>状态：${status} ${scriptProgress}</div>

      </div>
    `;
  };

  // 构建邮件内容
  const content = `
        Day ${day} 会议安排概览
      
      ${meetings.length > 0 ? 
        meetings.map(generateMeetingHTML).join('') : 
        `<div style="text-align: center; color: rgba(0,0,0,0.25);">
          今日无会议安排
        </div>`
      }

  `;

  const dailyEmail: Email = {
    id: `day${day}_meetings_${Date.now()}`,
    from: '系统日程助手',
    to: ['player'],
    subject: `Day ${day} 会议安排（共${meetings.length}个会议）`,
    content: content,
    isRead: false,
    day: day,
    metadata: {
      requiresAction: meetings.some(m => !m.completed),
      category: 'system',
    }
  };

  return dailyEmail;
};

export default {SYSTEM_EMAILS,CLIENT_EMAILS,dailyEmail} 