export interface PlayerEvent {
    id: number;
    eventType: string;
  }

  export interface GameEvent {
    id: number;
    type: 'system' | 'player' | 'auto';
    trigger: 'time' | 'action' | 'email';
    preconditions: number[]; // 需要完成的事件ID
    actions: {
      addEmails?: Email[];
      addTasks?: Task[];
      addRecipients?: Recipient[];
      updateProgress?: number;
    };
    nextEvents?: number[]; // 可能触发的后续事件
  }