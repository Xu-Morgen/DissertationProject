import type { Task } from '@/types';

export const INITIAL_TASKS: Task[] = [{
  id: 'tutorial',
  title: '完成新手引导',
  description: '通过邮件系统学习基本操作',
  status: 'backlog',
  priority: 'high',
  creator: 'boss', // 修改为 'boss' 或 'client'
  createdAt: 0,
  blocked: false
}];

export const TASK_TEMPLATES: Record<string, Omit<Task, 'id' | 'createdAt'>> = {
  analytics: {
    title: '用户分析面板',
    description: '开发用户行为分析功能',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    creator: 'client', // 仅允许 'player' | 'boss' | 'client'
    blocked: false,
    dependencies: ['task_data_api']
  }
};