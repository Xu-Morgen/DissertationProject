// stores/emailStore.ts
import { defineStore } from 'pinia';
import type { CalendarEvent, Email, Recipient, Reply,  SentFormat } from '@/types';
import contacts from '@/data/contacts';

import sentFormat from '@/data/sentFormat';

export const useEmailStore = defineStore('email', {
  state: () => ({
    inbox: [] as Email[],
    sent: [] as Email[],
    answeredEmail:[] as Email[],
    contacts: [] as Recipient[],
    sentFormat:[] as SentFormat[],
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
     * 添加新邮件到收件箱
     * @param email 不包含id和isRead的新邮件对象
     */
    addEmailWithId(email: Omit<Email, | 'isRead'>) {
      this.inbox.unshift({
        ...email,
        isRead: false
      });
    },
    

    /**
   * 发送新邮件到发件箱
   * @param email 不包含id和isRead的新邮件对象
   */
    sentEmail(email: Omit<Email, 'id' | 'isRead'>) {
      this.sent.unshift({
        ...email,
        id: `email_${Date.now()}`,
        isRead: true
      });
    },

    
  /**
   * 添加新收件人
   * @param RecipientId 收信人的id
   */
    addRecipient(RecipientId:string) {
      const newRecipient = contacts.CONTACTS[RecipientId]
      if (newRecipient) {
        const alreadyExists = this.contacts.some(c => c.id === newRecipient.id);
        if (!alreadyExists) {
          this.contacts.push(newRecipient);
        }
      }
      
    },
  /**
   * 删去收件人
   * @param RecipientId 收信人的id
   */
      removeRecipient(RecipientId:string) {
        const removeRecipient = contacts.CONTACTS[RecipientId]
        if (removeRecipient){
          this.contacts = this.contacts.filter(t=>t != removeRecipient)
        }
      },



  /**
   * 添加新发件格式
   * @param SentId 发件格式的id
   */
    addSentFormat(SentId:string) {
      const newSentFormat = sentFormat.SENT.find(s=>s.id == SentId)
      if (newSentFormat){
        this.sentFormat.push(newSentFormat)
      }
  },

  addNewSentFormat(newSentFormat:SentFormat){
    this.sentFormat.push(newSentFormat)
  },


  /**
   * 删去发件格式
   * @param SentId 发件格式的id
   */
    removeSentFormat(SentId:string) {
      const removeSentFormat = sentFormat.SENT.find(s=>s.id == SentId)
      console.log(removeSentFormat)
      if (removeSentFormat){
        this.sentFormat = this.sentFormat.filter(t=>t.id != removeSentFormat.id)
        console.log(this.sentFormat)
      }
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

      // 将作出回应的邮件记录列表
      this.answeredEmail.push({
        ...email,
        from: 'player',
        to: [email.from],
        content: reply.text,
        isRead: true,
        metadata: { ...email.metadata }
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
      const email = this.inbox.find(e => e.id == emailId);
      if (email) {
        email.isRead = true;
      }
    }
  },

  getters: {
     // 根据收件人筛选对应的主题
     getSubjectsByRecipient: (state) => (recipientId: string) => {
      return state.sentFormat.filter(mail => mail.relate.id === recipientId);
    },
    
    
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