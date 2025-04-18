import type { PersonalTask, Task } from '@/types';



const TASK_TEMPLATES: Record<string, Omit<Task, 'id' | 'createdAt'>> = {
  analytics: {
    title: 'User analysis panel',
    description: 'Develop user behavior analysis functions',
    status: 'backlog',
    priority: 'none',
    storyPoints: 8,
    creator: 'client', // 仅允许 'player' | 'boss' | 'client'
    blocked: false,
    progress:0,
  },
  test:{
    title: "test task",
    description: 'this is a test task',
    status: 'backlog',
    priority: 'none',
    blocked: false,
    creator: 'boss',
    progress:0,
    storyPoints:18,
  }
};

const PERSONAL_TASK:PersonalTask[]=[
  {
    id: 'first_email',
    title: 'Tutorial: First Email',
    description: 'Click on the first email in your inbox to view the details',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  {
    id: 'first_reply',
    title: 'Tutorial: First Sent',
    description: 'Click on the Send Email button in the upper right corner to send your report email to the boss.',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  { 
    id:'first_kanban_work',
    title:"Tutorial: First kanban work",
    description:"Click Kanban in the lower left corner to add new engineering tasks to urgent, and send a report to the Scurm team after the adjustment is completed.",
    status:'todo',
    creator:'client',
    createdAt:0
  },
  { 
    id:'first_meeting',
    title:"Tutorial: Arrange a meeting via email",
    description:"Click the Send Email button, select the Scrum team, and hold an orientation meeting today",
    status:'todo',
    creator:'client',
    createdAt:0
  },
  { 
    id:'first_day',
    title:"The tutorial has ended",
    description:"Please click Next Day to officially start the game, click the Next Day button in the lower right corner",
    status:'todo',
    creator:'client',
    createdAt:0
  },
]



export default {TASK_TEMPLATES,PERSONAL_TASK} 