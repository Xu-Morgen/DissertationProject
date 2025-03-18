import type { Email, Reply } from '@/types';

const SYSTEM_EMAILS: Email[] = [{
  id: 'welcome',
  from: 'system',
  to: ['player'],
  subject: '欢迎加入Scrum团队！',
  content: `亲爱的项目经理，<br><br>请开始你的第一个Sprint...`,
  day: 0,
  isRead: false, // 添加 isRead 字段
  replies: [{
    id: 'accept',
    text: '好的主人',
    nextEventId: 'start_first_sprint',
    affectsSatisfaction: +5
  }],
  triggers: ['game_start'],
  metadata: {
    requiresAction: true,
    category: 'system'
  }
}];

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