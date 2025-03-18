export interface Task {
    id: number;
    title: string;
    description: string;
    type: 'main' | 'daily' | 'urgent';
    requiredActions: string[]; // 如['send_email:boss@company.com']
    reward: {
      unlockFeatures?: string[];
      addRecipients?: string[];
    };
    state: 'pending' | 'active' | 'completed';
    deadline?: number; // 时间戳
  }