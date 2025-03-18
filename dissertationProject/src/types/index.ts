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
  replies: Reply[];   // 可用的回复选项
  triggers?: string[]; // 触发的事件ID列表
  metadata: {
    requiresAction: boolean;    // 是否需要玩家操作
    associatedTask?: string;    // 关联的任务ID
    autoReply?: boolean;        // 是否为自动生成回复
    category: 'system' | 'client' | 'boss' | 'team'; // 邮件分类
  };
}

export interface Reply {
  id: string;
  text: string;                 // 显示的回复文本
  nextEventId?: string;         // 触发的后续事件ID
  affectsSatisfaction?: number; // 客户满意度变化值（-10 ~ +10）
  unlocksTask?: string;         // 解锁的新任务ID
  requiresDays?: number;        // 需要消耗的游戏天数
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  isUnlocked: boolean;          // 是否已解锁
  signature?: string;           // 邮件签名
}

export interface SentFormat{
  id:string;
  subject:string;//标题
  content:string;//内容
  relate:Recipient[];//能对谁发送这份内容
  nextEventId?: string;         // 触发的后续事件ID
}

/* ================= 任务系统 ================= */
export type TaskStatus = 'backlog' | 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: number;         // 故事点数（用于Sprint计算）
  sprintId?: string;            // 所属Sprint的ID
  blocked: boolean;             // 是否被阻塞
  blockerReason?: string;       // 阻塞原因
  creator: 'player' | 'boss' | 'client'; // 任务来源
  createdAt: GameDate;
  deadline?: GameDate;          // 截止天数（可选）
  dependencies?: string[];      // 依赖的任务ID列表
}

export interface PersonalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  creator: 'player' | 'boss' | 'client'; // 任务来源
  createdAt: GameDate;
  deadline?: GameDate;          // 截止天数（可选）
}

/* ================= 日历系统 ================= */
export type MeetingType = 'daily' | 'sprint' | 'client' | 'personal';

export interface CalendarEvent {
  id: string;
  type: MeetingType;
  title: string;
  day: GameDate;                // 预定在第几天
  participants: string[];       // 参会者ID列表
  requiredTasks?: string[];     // 会前需完成的任务ID
  completed: boolean;           // 是否已完成
  outcome?: {
    progressReport?: string;    // 进度报告内容
    resolvedBlockers?: string[]; // 解决的阻塞问题列表
    satisfactionChange?: number; // 客户满意度变化
    unlockedTasks?: string[];   // 解锁的新任务ID
  };
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


export interface GameEvent {
  id: string;
  trigger: string;             // 触发条件（例："email_reply:accept_welcome"）
  actions: GameEventAction[];  // 触发后的行为列表
  isOnce?: boolean;            // 是否只能触发一次
}

/* ================= UI状态 ================= */
export interface UIState {
  configModalOpen:boolean,
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