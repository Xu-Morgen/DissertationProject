import { useCalendarStore } from "../stores/calendarStore";
import type { CalendarEvent, Email } from "../types";

const CommonUtils = {
  // 计算剩余天数
  daysLeft(deadline: number) {
    return deadline - useCalendarStore().currentDay;
  },

  // 验证会议配置有效性
  validateMeetings(meetings: CalendarEvent[]) {
    return meetings.every(m => {
      const valid = Number.isInteger(m.day) && m.day >= 0;
      if (!valid) console.error(`Invalid day in meeting ${m.id}`);
      return valid;
    });
  },

  // Omit Email 中的 id 和 isRead
  omitEmail(email: Email) {
    const { id, isRead, ...omitEmail } = email;
    return omitEmail;
  }
};

//  默认导出
export default CommonUtils;
