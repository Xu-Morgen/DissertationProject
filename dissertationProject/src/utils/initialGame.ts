// utils/initializeGameData.ts
import { useTaskStore } from '@/stores/taskStore';
import { useEmailStore } from '@/stores/emailStore';
import { useCalendarStore } from '@/stores/calendarStore';
import TASK_DATA from '@/data/tasks';
import EMAIL_DATA from '@/data/emails';
import CONTACTS from '@/data/contacts';
import MEETINGS from '@/data/meetings';




import type { GameEvent } from '@/types'
import { useEventStore } from '@/stores/eventStore'
import MeetingData from '@/data/meetings'

// 封装静态配置为动态注册
export function initializeGameEvents() {
  const eventStore = useEventStore();

  const predefinedEvents: GameEvent[] = [
    {
      id: 'daily_check',
      actions: [{ type: 'daily_check' }]
    },
    {
      id: 'first_reply_message',
      actions: [
        { type: 'add_personal_task', taskId: 'first_reply' },
        { type: 'finish_personal_task', taskId: 'first_email' },
        { type: 'add_recipient', recipientId: 'boss' },
        { type: 'add_sent_format', replyId: 'first_reply' }
      ]
    },
    {
      id: 'finish_first_reply',
      actions: [
        { type: 'finish_personal_task', taskId: 'first_reply' },
        { type: 'remove_sent_format', replyId: 'first_reply' },
        { type: 'add_email', templateId: 'see_kanban' }
      ]
    },
    {
      id: 'do_first_kanban',
      actions: [
        { type: 'add_personal_task', taskId: 'first_kanban_work' },
        { type: 'add_task', taskId: 'analytics' },
        { type: 'add_sent_format', replyId: 'first_kanban' },
        { type: 'add_recipient', recipientId: 'team' }
      ]
    },
    {
      id: 'do_first_meeting',
      actions: [
        { type: 'add_personal_task', taskId: 'first_meeting' },
        { type: 'add_sent_format', replyId: 'make_meeting' },
        {
          type: 'add_meeting_can_use',
          meetingFrom: MeetingData.FRESH_MEETINGS,
          meetingId: 'fresher_meeting'
        }
      ]
    }
  ];

  for (const event of predefinedEvents) {
    eventStore.registerEvent(event);
  }

  console.log('[INIT] Game Events Registered');
}
