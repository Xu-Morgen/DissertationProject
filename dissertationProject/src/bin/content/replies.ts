import type { GameReply } from './type';

export const REPLIES: Record<number, GameReply> = {
  2001: {
    id: 2001,
    content: "同意时间安排",
    nextEventId: 3002,
    effect: { trust: +5 }
  },
  2002: {
    id: 2002,
    content: "需要调整时间",
    nextEventId: 3003
  }
};