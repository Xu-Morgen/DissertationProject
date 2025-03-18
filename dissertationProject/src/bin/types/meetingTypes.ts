// types/meetingTypes.ts
export interface MeetingAgenda {
    id: string;
    topic: string;
    duration: number; // 分钟
    status: 'pending' | 'discussing' | 'resolved';
    relatedTaskId?: number;
  }
  
  export interface MeetingDecision {
    resolution: 'approved' | 'rejected' | 'deferred';
    followUpTasks: number[];
    impactVariables: Record<string, number>;
  }
  
  export interface MeetingParticipant {
    userId: number;
    role: 'organizer' | 'presenter' | 'attendee';
    prepStatus: 'not-started' | 'in-progress' | 'completed';
  }