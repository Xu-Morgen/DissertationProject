import { useCalendarStore } from "../stores/calendarStore";
import type { CalendarEvent } from "../types";

// 计算剩余天数
const daysLeft = (deadline: number) => {
    return deadline - useCalendarStore().currentDay;
  };

  // 验证会议配置有效性
function validateMeetings(meetings: CalendarEvent[]) {
    return meetings.every(m => {
      const valid = Number.isInteger(m.day) && m.day >= 0;
      if (!valid) console.error(`Invalid day in meeting ${m.id}`);
      return valid;
    });
  }