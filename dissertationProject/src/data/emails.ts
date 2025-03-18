import type { Email, Reply } from '@/types';

const SYSTEM_EMAILS: Email[] = [{
  id: 'welcome',
  from: 'system',
  to: ['player'],
  subject: '欢迎加入Scrum团队！',
  content: `亲爱的项目经理，<br><br>请开始你的第一个Sprint...`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: '好的主人',
    nextEventId: 'first_reply_message',
    affectsSatisfaction: +5
  }],
  triggers: ['event1'],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
},{
  id: 'see_kanban',
  from: 'boss',
  to: ['player'],
  subject: '欢迎你的报道',
  content: `亲爱的项目经理，<br><br>去看眼Kanban长啥样吧...`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: '好的主人',
    nextEventId: 'do_first_kanban',
    affectsSatisfaction: +5
  }],
  triggers: ['event1'],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
},{
  
    id: 'first_kanban_failed',
    from: 'team',
    to: ['player'],
    subject: '你的验证未能通过，请仔细检查kanban内容',
    content: `kanban都不会调整，去死吧<br><br>杀杀杀！...`,
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
  subject: '你的验证成功通过',
  content: `我们现在以及迫不及待想和你开展一场会议了！！...`,
  day: 0,
  isRead: false, 
  replies: [{
    id: 'accept',
    text: '好的主人',
    nextEventId: 'do_first_meeting',
    affectsSatisfaction: +5
  }],
  triggers: ['event1'],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
}

];



 const CLIENT_EMAILS: Email[] = [{
  id: 'client_request',
  from: 'client',
  to: ['player'],
  subject: '新功能需求',
  content: `我们希望增加用户分析面板...`,
  day: 3,
  isRead: false, // 添加 isRead 字段
  replies: [
    {
      id: 'agree',
      text: '加入当前Sprint',
      nextEventId: 'add_analytics_task',
      requiresDays: 2
    },
    {
      id: 'delay',
      text: '下个Sprint处理',
      affectsSatisfaction: -10
    }
  ],
  metadata: {
    requiresAction: true,
    category: 'client',
    associatedTask: 'task_user_analytics'
  },
  triggers: ["new requirements analyse"]
}];

export default {SYSTEM_EMAILS,CLIENT_EMAILS} 