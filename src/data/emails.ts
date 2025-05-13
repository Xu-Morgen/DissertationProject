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
  isRead: false, 
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
  const generateMeetingHTML = (meeting: CalendarEvent) => {
    const status = meeting.completed ? 
      '<span style="color: #52c41a;">✓ finished</span>' : 
      '<span style="color: #ff4d4f;">◷ in progress</span>';
    const scriptProgress = `status：${meeting.completed ? 'finish' : `in progress`}`

    return `
      <div ">
        <h3>${meeting.title}</h3>
          <div>type：${meeting.type}</div>
          <div>viewver：${meeting.participants.name}</div>
          <div>status：${status} ${scriptProgress}</div>

      </div>
    `;
  };

  const content = `
        Day ${day} meetingn schedule
      
      ${meetings.length > 0 ? 
        meetings.map(generateMeetingHTML).join('') : 
        `<div style="text-align: center; color: rgba(0,0,0,0.25);">
          no meeting today
        </div>`
      }

  `;

  const dailyEmail: Email = {
    id: `day${day}_meetings_${Date.now()}`,
    from: 'daily system helper',
    to: ['player'],
    subject: `Day ${day} meeting arrangement（have ${meetings.length} meetings）`,
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