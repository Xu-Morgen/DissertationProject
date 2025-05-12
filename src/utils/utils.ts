import { useCalendarStore } from "../stores/calendarStore";
import type { CalendarEvent, Email } from "../types";

const CommonUtils = {
  daysLeft(deadline: number) {
    return deadline - useCalendarStore().currentDay;
  },

  validateMeetings(meetings: CalendarEvent[]) {
    return meetings.every(m => {
      const valid = Number.isInteger(m.day) && m.day >= 0;
      if (!valid) console.error(`Invalid day in meeting ${m.id}`);
      return valid;
    });
  },

  omitEmail(email: Email) {
    const { id, isRead, ...omitEmail } = email;
    return omitEmail;
  }
};

export default CommonUtils;
