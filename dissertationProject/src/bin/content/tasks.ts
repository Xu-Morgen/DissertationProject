import type { GameTask } from './type';

export const TASKS: Record<number, GameTask> = {
  1001: {
    id: 1001,
    title: "新人报到",
    description: "发送邮件至 boss@company.com 完成入职登记",
    requiredActions: ["send_email"],
    unlock: ["kanban"]
  },
  1002: {
    id: 1002,
    title: "项目启动会议",
    description: "安排并主持第一次项目组会议",
    requiredActions: ["schedule_meeting", "invite_members"]
  }
};