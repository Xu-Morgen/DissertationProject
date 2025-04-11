// types/index.ts

/* ================= 核心类型 ================= */
export type GameDate = number; // 表示游戏开始后的天数

/* ================= 邮件系统 ================= */
export interface Email {
  id: string;
  from: string;       // 发件人ID（对应contacts中的ID）
  to: string[];       // 收件人ID列表
  subject: string;
  content: string;    // 支持HTML格式
  isRead: boolean;
  day: GameDate;      // 邮件所属游戏天数
  replies?: Reply[];   // 可用的回复选项
  metadata: {
    requiresAction: boolean;    // 是否需要玩家操作
    category: 'system' | 'client' | 'boss' | 'team' ; // 邮件分类
  };
}

export interface Reply {
  id: string;
  text: string;                 // 显示的回复文本
  nextEventId?: string;         // 触发的后续事件ID
}

export interface Recipient {
  id: string;
  name: string;
}

export interface SentFormat{
  id:string;
  subject:string;//标题
  content:string;//内容
  relate:Recipient;//能对谁发送这份内容
  nextEventId?: string;         // 触发的后续事件ID
  type:"normal" | "meeting";
  meetingid?:string;
}

/* ================= 任务系统 ================= */
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'none'|'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;         // 故事点数（用于Sprint计算）
  sprintId?: string;            // 所属Sprint的ID
  blocked: boolean;             // 是否被阻塞
  blockerReason?: string;       // 阻塞原因
  creator: 'player' | 'boss' | 'client'; // 任务来源
  createdAt: GameDate;
  deadline?: GameDate;          // 截止天数（可选）
  progress:number;
  dueDay?: number; // 添加这个属性
  isCustomerTask?: boolean;
  linkedMeetingId?: string; // 关联的会议ID
  linkedPersonalTaskId?: string; // 关联的个人任务ID
}

export interface PersonalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: 'player' | 'boss' | 'client'; // 任务来源
  createdAt: GameDate;
  deadline?: GameDate;          // 截止天数（可选）
  linkedTaskId?: string; // 关联的客户任务ID

}

/* ================= 日历系统 ================= */
export type MeetingType = 'daily' | 'sprint' | 'client' | 'personal';

// 更新CalendarEvent类型
export interface CalendarEvent {
  id: string;
  type: MeetingType;
  title: string;
  day: GameDate;
  participants: Recipient;
  completed: boolean;
  scripts?: ScriptStep[]; // 替换outcome为scripts
  finishEventId?:string;
  canDelete:boolean;
  linkedTaskId?:string;
}

// 更新ScriptStep类型
export interface ScriptStep {
  sys: string;
  options?: Array<{
    text: string;
    effects?: GameEventAction[]; // 改为GameEventAction数组
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
  time: 'start' | 'end'; // 每日开始或结束时自动创建
  participants: string[];
}

/* ================= Sprint系统 ================= */
export interface Sprint {
  id: string;
  name: string;                 // Sprint名称（例："Sprint 1 - 登录模块"）
  startDay: GameDate;           // 开始天数
  endDay: GameDate;             // 结束天数
  goal: string;                 // Sprint目标描述
  velocity: number;             // 团队速率（points/day）
  committedTasks: string[];     // 承诺的任务ID列表
  completedPoints: number;      // 已完成故事点
}

/* ================= 事件系统 ================= */
export type GameEventAction = 
  | { type: 'add_email'; templateId: string }      // 添加邮件
  | { type: 'modify_satisfaction'; value: number } // 修改满意度
  | { type: 'unlock_feature'; feature: string }    // 解锁功能
  | { type: 'schedule_meeting'; meetingId: string }// 安排会议
  | { type: 'advance_day'; days: number }         // 推进天数
  | { type: 'add_task'; taskId: string }           // 添加任务
  | { type: "add_personal_task";taskId: string} //添加个人任务
  | { type: 'finish_personal_task';taskId:string} //完成个人任务 
  | { type: 'finish_task';taskId:string} //完成任务 
  | { type: 'add_sent_format';replyId:string} //增加可用的发送格式
  | { type: 'remove_sent_format';replyId:string} //删去不再可用的发送格式
  | { type: 'add_recipient';recipientId:string} //增加新的可联系人
  | { type: 'remove_recipient';recipientId:string} //删去不再可用的联系人
  | { type: 'add_meeting_can_use';meetingId:string;meetingFrom:CalendarEvent[]} //增加可用的会议类型
  | { type: 'remove_meeting_can_use';meetingId:string} // 删去某些特定的会议类型
  | { type: 'add_daily_mail';templateId:string} //每日添加邮件
  | { type:'daily_check'} // 每日检查，按照顺序添加邮件和客户会议
  //特殊任务列表
  | {type:'do_first_kanban'}//第一次kanban任务
  | {type:"log_to_console",message:string}
  | {type:'unlock_next_day_btn'}

export interface GameEvent {
  id: string;
  actions: GameEventAction[];  // 触发后的行为列表
}

/* ================= UI状态 ================= */
export interface UIState {
  configModalOpen:boolean,
  nextDayBtnCanUse:boolean,
  readingEmailModalOpen:boolean,
  sendingEmailModalOpen:boolean,
  activeView: 'mail' | 'kanban' | 'calendar';
  emailFilter: {
    unreadOnly: boolean;
    category?: Email['metadata']['category'];
  };
  kanban: {
    visibleColumns: Record<string, boolean>;
  };
}