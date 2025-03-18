// stores/emailStore.ts
import { defineStore } from 'pinia';
import type { Email, Recipient, Reply } from '@/types';

export const useEmailStore = defineStore('email', {
  state: () => ({
    inbox: [] as Email[],
    sent: [] as Email[],
    contacts: [
      {
        id: 'boss',
        name: '项目经理',
        email: 'boss@company.com',
        isUnlocked: true,
        signature: '请及时跟进项目进度'
      },
      {
        id: 'client',
        name: '主要客户',
        email: 'client@corp.com',
        isUnlocked: false,
        signature: '期待您的回复'
      }
    ] as Recipient[]
  }),

  actions: {
    /**
     * 添加新邮件到收件箱
     * @param email 不包含id和isRead的新邮件对象
     */
    addEmail(email: Omit<Email, 'id' | 'isRead'>) {
      this.inbox.unshift({
        ...email,
        id: `email_${Date.now()}`,
        isRead: false
      });
    },

    /**
     * 处理邮件回复
     * @param emailId 目标邮件ID
     * @param replyId 选择的回复ID
     */
    processReply(emailId: string, replyId: string) {
      const email = this.inbox.find(e => e.id === emailId);
      const reply = email?.replies?.find(r => r.id === replyId);

      if (!email || !reply) return;

      // 将回复移到已发送
      this.sent.push({
        ...email,
        from: 'player',
        to: [email.from],
        content: reply.text,
        isRead: true,
        metadata: { ...email.metadata, autoReply: true }
      });

      // 移除非持续型邮件
      if (!email.metadata.requiresAction) {
        this.inbox = this.inbox.filter(e => e.id !== emailId);
      }
    },

    /**
     * 标记邮件为已读
     */
    markAsRead(emailId: string) {
      const email = this.inbox.find(e => e.id === emailId);
      if (email) email.isRead = true;
    }
  },

  getters: {
    /** 未读邮件数量 */
    unreadCount: (state) => state.inbox.filter(e => !e.isRead).length,

    /** 需要处理的紧急邮件 */
    urgentEmails: (state) => state.inbox.filter(
      e => e.metadata.requiresAction && !e.isRead
    ),

    /** 获取联系人名称 */
    getContactName: (state) => (id: string) => 
      state.contacts.find(c => c.id === id)?.name || id
  },
  persist:true,
});