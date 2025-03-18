import type { GameEvent } from './type';

export const EVENTS: Record<number, GameEvent> = {
  3001: {
    id: 3001,
    type: 'dialogue',
    trigger: 'first_login',
    content: "欢迎来到邮件职场模拟系统！请先完成新人报到任务。"
  },
  3002: {
    id: 3002,
    type: 'branch',
    trigger: 'meeting_confirmed',
    content: "会议时间已确认，请选择后续操作：",
    options: [2001, 2002]
  }
};