// types/emailTypes.ts
export interface Recipient {
    id: number;
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    avatar?: string; // 头像URL
    communicationStyle: 'formal' | 'casual' | 'technical';
    isUnlocked: boolean;
    responseTime: number; // 平均响应时间（小时）
    priority: number; // 0-5优先级
  }