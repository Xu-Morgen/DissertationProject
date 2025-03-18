export interface GameTask {
    id: number;
    title: string;
    description: string;
    requiredActions: string[];
    unlock?: string[];
  }
  
  export interface GameReply {
    id: number;
    content: string;
    nextEventId?: number;
    effect?: Record<string, number>;
  }
  
  export interface EmailTemplate {
    id: number;
    subject: string;
    content: string;
    variables?: string[];
  }
  
  export interface GameEvent {
    id: number;
    type: 'dialogue' | 'system' | 'branch';
    trigger: string;
    content: string;
    options?: number[]; // 关联回复ID
  }