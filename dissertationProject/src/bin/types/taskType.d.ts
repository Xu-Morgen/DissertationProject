// types/taskTypes.ts
export enum TaskPriority {
    UNASSIGNED = 'unassigned',
    MUST = 'must',
    SHOULD = 'should',
    CAN = 'can'
  }
  
  export enum TaskType {
    PERSONAL = 'personal',
    PROJECT = 'project'
  }
  
  export interface BaseTask {
    id: number;
    title: string;
    description: string;
    deadline?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
    priority: TaskPriority;
    type: TaskType;
  }
  
  export interface PersonalTask extends BaseTask {
    type: TaskType.PERSONAL;
    requiredActions: string[];
    relatedEmailId?: number;
  }
  
  export interface ProjectTask extends BaseTask {
    type: TaskType.PROJECT;
    assigneeIds: number[];
    dependencies: number[];
    kanbanStatus: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  }