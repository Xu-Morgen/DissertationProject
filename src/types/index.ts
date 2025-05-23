// types/index.ts

export type GameDate = number;


export interface Email {
  id: string;
  from: string;
  to: string[];
  subject: string;
  content: string;
  isRead: boolean;
  day: GameDate;
  replies?: Reply[];
  metadata: {
    requiresAction: boolean;
    category: 'system' | 'client' | 'boss' | 'team';
    onOpenEventId?:string
  };
}

export interface Reply {
  id: string;
  text: string;
  nextEventId?: string;
}

export interface Recipient {
  id: string;
  name: string;
  isEmergency: boolean;
}

export interface SentFormat {
  id: string;
  subject: string;
  content: string;
  relate: Recipient;
  nextEventId?: string;
  type: "normal" | "meeting" | "emergency";
  meetingid?: string;

}

export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  sprintId?: string;
  blocked: boolean;
  creator: 'player' | 'boss' | 'client';
  createdAt: GameDate;
  deadline?: GameDate;
  progress: number;
  dueDay?: number;
  isCustomerTask?: boolean;
  linkedMeetingId?: string;
  linkedPersonalTaskId?: string;
}
export type YesterdayTask = {
  id: string;
  title: string;
  status: 'done' | 'inProgress';
  progress: number;
};

export interface PersonalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: 'player' | 'boss' | 'client' | 'system';
  createdAt: GameDate;
  deadline?: GameDate;
  linkedTaskId?: string;
  emergencyTemplateId?: string;
}

export type MeetingType = 'daily' | 'sprint' | 'client' | 'personal';

export interface CalendarEvent {
  id: string;
  type: MeetingType;
  title: string;
  day: GameDate;
  participants: Recipient;
  completed: boolean;
  scripts?: ScriptStep[];
  finishEventId?: string;
  canDelete: boolean;
  linkedTaskId?: string;
}

export interface ScriptStep {
  sys: string;
  options?: Array<{
    text: string;
    effects?: GameEventAction[];
  }>;
}

export interface MeetingTemplate {
  id: string;
  type: 'daily' | 'retro' | 'planning';
  scripts: ScriptStep[];
  variables: {
    completedTasks: string[];
    todaysMeetings: string[];
  };
}

export interface DailyMeetingConfig {
  autoCreate: boolean;
  time: 'start' | 'end';
  participants: string[];
}

export interface Sprint {
  id: string;
  name: string;
  startDay: GameDate;
  endDay: GameDate;
  goal: string;
  committedTasks: string[]; 
  completedPoints: number;
}

export type GameEventAction =
  | { type: 'add_email'; templateId: string }
  | { type: 'modify_satisfaction'; value: number }
  | { type: 'unlock_feature'; feature: string }
  | { type: 'schedule_meeting'; meetingId: string }
  | { type: 'advance_day'; days: number }
  | { type: 'add_task'; taskId: string }
  | { type: 'add_personal_task'; taskId: string }
  | { type: 'finish_personal_task'; taskId: string }
  | { type: 'finish_task'; taskId: string }
  | { type: 'add_sent_format'; replyId: string }
  | { type: 'remove_sent_format'; replyId: string }
  | { type: 'add_recipient'; recipientId: string }
  | { type: 'remove_recipient'; recipientId: string }
  | { type: 'add_meeting_can_use'; meetingId: string; meetingFrom: CalendarEvent[] }
  | { type: 'remove_meeting_can_use'; meetingId: string }
  | { type: 'add_daily_mail'; templateId: string }
  | { type: 'daily_check' }
  | { type: 'do_first_kanban' }
  | { type: 'log_to_console'; message: string }
  | { type: 'unlock_next_day_btn' }
  | { type: 'boost_worker' }
  | { type: 'block_tasks_by_keyword'; keywords: string[] }
  | { type: 'add_emergency_task_personal';task:PersonalTask}
  | { type: 'unblock_tasks_by_keyword';keywords:string[]}
  | {type:'change_satisfaction',value:number}
  | {type:'change_worker',value:number}


export interface GameEvent {
  id: string;
  actions: GameEventAction[];
}

export type EmergencyTemplate = {
  id: string;
  title: string;
  description?: string;
  autoGenerate?: {
    email?: {
      subject: string;
      content: string;
      recipients: string[];
    };
    meeting?: {
      templateId: string;
      daysAfter: number;
    };
  };
  effects?: {
    blockKeywords?: string[]; 
    boostWorker?: boolean;   
    custom?:string;
  };
};

export interface UIState {
  configModalOpen: boolean;
  nextDayBtnCanUse: boolean;
  readingEmailModalOpen: boolean;
  sendingEmailModalOpen: boolean;
  activeView: 'mail' | 'kanban' | 'calendar';

  kanban: {
    visibleColumns: Record<string, boolean>;
  };
}
