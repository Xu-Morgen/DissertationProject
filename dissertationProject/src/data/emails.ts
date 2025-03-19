import type { Email, Reply } from '@/types';

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

export default {SYSTEM_EMAILS,CLIENT_EMAILS} 