// types/emails.d.ts
import type { Time } from './datetime';
import type { PlayerEvent } from './events';

export interface BaseEmail {
  id: number;
  subject: string;
  detail: string;
  timestamp: Time;
  read:boolean;
  sender?: string;
  event?: PlayerEvent;
}

export interface TaskEmail extends BaseEmail {
  type: 'Task';
  task: Task;
}

export interface ReplyEmail extends BaseEmail {
  type: 'Reply';
  reply: Reply;
}

export interface UserTaskEmail extends BaseEmail {
  type: 'UserTask';
  userTask: UserTask;
}

export interface SentEmail extends BaseEmail {
  type: 'Sent';
  recipients: string[];
}

export type Email = TaskEmail | ReplyEmail | UserTaskEmail | SentEmail;

// 子类型定义
export interface Task {
  id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  priority: 'must' | 'should' | 'can' | 'optional';
  deadline?: Time;
  relatedEmailId?: number;
}

export interface Reply {
  id: number;
  relatedEmailIds: number[];
  options: Array<{ 
    id: string;
    label: string; 
    nextEvent?: PlayerEvent 
  }>;
}

export interface UserTask {
  id: number;
  required: boolean;
  completed: boolean;
  verificationRequired: boolean;
}

export interface Email {
  id: number;
  type: 'Task' | 'Reply' | 'Message' | 'Event';
  subject: string;
  content: string;
  sender?: string;
  recipients?: string[];
  relatedEvent?: number;
  taskId?: number;       // 新增关联任务ID
  replyOptions?: Reply[];// 新增回复选项
  isRead: boolean;
  timestamp: number;
}