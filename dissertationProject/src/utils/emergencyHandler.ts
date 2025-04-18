// src/utils/emergencyHandler.ts

import { EMERGENCY_TEMPLATES } from '../data/emergency';
import { GAME_EVENTS } from '../data/events';
import { useTaskStore } from '../stores/taskStore';
import { useEmailStore } from '../stores/emailStore';
import { useCalendarStore } from '../stores/calendarStore';
import type { EmergencyTemplate, GameEvent } from '../types';

export function autoGenerateEmergency(templateId: string) {
  const template = EMERGENCY_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    console.warn(`No emergency template found for id: ${templateId}`);
    return;
  }

  const taskStore = useTaskStore();
  const emailStore = useEmailStore();
  const calendarStore = useCalendarStore();

  // 1. 添加任务
  if (template.relatedTaskId) {
    taskStore.addTaskById(template.relatedTaskId); // 你可能需要实现这个函数
  }

  // 2. 添加紧急邮件
  if (template.autoGenerate?.email) {
    const emailId = `auto_email_${template.id}`;
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

  // 3. 安排会议
  if (template.autoGenerate?.meeting) {
    const meetingId = `emergency_meeting_${template.id}`;
    const dayToSchedule = calendarStore.currentDay + template.autoGenerate.meeting.daysAfter;

    calendarStore.scheduleMeeting({
      id: meetingId,
      type: 'personal',
      title: `[紧急] ${template.title}`,
      day: dayToSchedule,
      participants: {
        id: 'user',
        name: '你',
        isEmergency: true
      },
      scripts: [], // 你可以从模板加载脚本
      completed: false,
      canDelete: true,
      linkedTaskId: template.relatedTaskId,
      finishEventId: `finish_emergency_${template.id}`
    });
  }

  // 4. 自动生成 GameEvent
  const generatedEvent: GameEvent = {
    id: `finish_emergency_${template.id}`,
    actions: []
  };

  if (template.relatedTaskId) {
    generatedEvent.actions.push({ type: 'add_task', taskId: template.relatedTaskId });
  }

  if (template.autoGenerate?.email) {
    generatedEvent.actions.push({ type: 'add_email', templateId: `auto_email_${template.id}` });
  }

  // 注册 GameEvent（直接挂载到 GAME_EVENTS）
  GAME_EVENTS[generatedEvent.id] = generatedEvent;
}
