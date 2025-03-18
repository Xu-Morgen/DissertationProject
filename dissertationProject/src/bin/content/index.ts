// content/index.ts
import { TASKS } from './tasks';
import { REPLIES } from './replies';
import { EMAILS } from './emails';
import { EVENTS } from './events';
import type { GameTask, GameReply, EmailTemplate, GameEvent } from './types';

type ContentTypeMap = {
  task: GameTask;
  reply: GameReply;
  email: EmailTemplate;
  event: GameEvent;
};

export const ContentService = {
  // 单条获取方法
  getTask(id: number): GameTask | null {
    return TASKS[id] ?? null;
  },

  getReply(id: number): GameReply | null {
    return REPLIES[id] ?? null;
  },

  getEmailTemplate(id: number): EmailTemplate | null {
    return EMAILS[id] ?? null;
  },

  getEvent(id: number): GameEvent | null {
    return EVENTS[id] ?? null;
  },

  // 函数重载声明（注意分号分隔）
  getMultiple(type: 'task', ids: number[]): GameTask[];
  getMultiple(type: 'reply', ids: number[]): GameReply[];
  getMultiple(type: 'email', ids: number[]): EmailTemplate[];
  getMultiple(type: 'event', ids: number[]): GameEvent[];
  // 实现部分（注意参数间的逗号）
  getMultiple(type: keyof ContentTypeMap, ids: number[]): (GameTask | GameReply | EmailTemplate | GameEvent)[] {
    const pool = {
      task: TASKS,
      reply: REPLIES,
      email: EMAILS,
      event: EVENTS
    }[type];

    return ids
      .map(id => pool[id])
      .filter((item): item is NonNullable<typeof item> => !!item);
  }
};