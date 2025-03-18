import type { PersonalTask, Task } from '@/types';

const INITIAL_TASKS: Task[] = [{
  id: 'tutorial',
  title: '完成新手引导',
  description: '通过邮件系统学习基本操作',
  status: 'backlog',
  priority: 'none',
  creator: 'boss', // 修改为 'boss' 或 'client'
  createdAt: 0,
  blocked: false
}];

const TASK_TEMPLATES: Record<string, Omit<Task, 'id' | 'createdAt'>> = {
  analytics: {
    title: '用户分析面板',
    description: '开发用户行为分析功能',
    status: 'backlog',
    priority: 'none',
    storyPoints: 8,
    creator: 'client', // 仅允许 'player' | 'boss' | 'client'
    blocked: false,
    dependencies: ['task_data_api']
  }
};

const PERSONAL_TASK:PersonalTask[]=[
  {
    id: 'first_email',
    title: '第一份邮件',
    description: '点击画面中央的第一份邮件来查看详情',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  {
    id: 'first_reply',
    title: '第一份回信',
    description: '点击右上角的发送邮件来向boss发送你的报道邮件',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  { 
    id:'first_kanban_work',
    title:"第一次kanban工作",
    description:"点击左下角的Kanban将新的工程任务添加到当前sprint中，调整完毕后向team发送报告",
    status:'todo',
    creator:'client',
    createdAt:0

  }
]

export default {INITIAL_TASKS,TASK_TEMPLATES,PERSONAL_TASK} 