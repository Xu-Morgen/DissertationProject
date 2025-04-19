import { EMERGENCY_TEMPLATES } from '../data/emergency';
import TASK_TEMPLATES_AUTO from '../data/tasks';

import { GAME_EVENTS } from '../data/events';
import { useTaskStore } from '../stores/taskStore';
import { useEmailStore } from '../stores/emailStore';
import { useCalendarStore } from '../stores/calendarStore';
import { useEventStore } from '../stores/eventStore';

export function autoGenerateEmergency(templateId: string) {
  const template = Object.values(EMERGENCY_TEMPLATES).find(
    (t: any) => t.id === templateId
  );
  if (!template) {
    console.warn(`No emergency template found for id: ${templateId}`);
    return;
  }

  const taskStore = useTaskStore();
  const emailStore = useEmailStore();
  const calendarStore = useCalendarStore();

  // ✅ 添加任务
  if (template.relatedTaskId && TASK_TEMPLATES_AUTO[template.relatedTaskId]) {
    const newTask = {
      id: template.relatedTaskId,
      createdAt: calendarStore.currentDay,
      ...TASK_TEMPLATES_AUTO[template.relatedTaskId]
    };
    taskStore.backlog.push(newTask);
  }

  // ✅ 添加邮件
  if (template.autoGenerate?.email) {
    const emailId = `auto_email_${template.id}`;
    // @ts-expect-error 忽略 id 限制
    emailStore.addEmail({
      id: emailId,
      from: 'system',
      to: template.autoGenerate.email.recipients,
      subject: template.autoGenerate.email.subject,
      content: template.autoGenerate.email.content,
      isRead: false,
      day: calendarStore.currentDay,
      replies: [],
      metadata: {
        requiresAction: true,
        category: 'system'
      }
    });
  }

  // ✅ 安排会议
  if (template.autoGenerate?.meeting) {
    calendarStore.scheduleMeeting({
      id: `emergency_meeting_${template.id}`,
      type: 'personal',
      title: `[紧急] ${template.title}`,
      day: calendarStore.currentDay + template.autoGenerate.meeting.daysAfter,
      participants: {
        id: 'user',
        name: '你',
        isEmergency: true
      },
      scripts: [],
      completed: false,
      canDelete: true,
      linkedTaskId: template.relatedTaskId,
      finishEventId: `finish_emergency_${template.id}`
    });
  }

  // ✅ 自动绑定 GameEvent
  const eventId = `finish_emergency_${template.id}`;
  if (!GAME_EVENTS[eventId]) {
    GAME_EVENTS[eventId] = {
      id: eventId,
      actions: []
    };
    if (template.relatedTaskId) {
      GAME_EVENTS[eventId].actions.push({ type: 'add_task', taskId: template.relatedTaskId });
    }
    if (template.autoGenerate?.email) {
      GAME_EVENTS[eventId].actions.push({ type: 'add_email', templateId: `auto_email_${template.id}` });
    }
  }
}
