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


    

    addEmail(email: Omit<Email, 'id' | 'isRead'>) {
      this.inbox.unshift({
        ...email,
        id: `email_${Date.now()}`,
        isRead: false
      });
    },


    addEmailWithId(email: Omit<Email, | 'isRead'>) {
      this.inbox.unshift({
        ...email,
        isRead: false
      });
    },
    


    sentEmail(email: Omit<Email, 'id' | 'isRead'>) {
      this.sent.unshift({
        ...email,
        id: `email_${Date.now()}`,
        isRead: true
      });
    },

    

    addRecipient(RecipientId:string) {
      const newRecipient = contacts.CONTACTS[RecipientId]
      if (newRecipient) {
        const alreadyExists = this.contacts.some(c => c.id === newRecipient.id);
        if (!alreadyExists) {
          this.contacts.push(newRecipient);
        }
      }
      
    },

      removeRecipient(RecipientId:string) {
        const removeRecipient = contacts.CONTACTS[RecipientId]
        if (removeRecipient){
          this.contacts = this.contacts.filter(t=>t != removeRecipient)
        }
      },




    addSentFormat(SentId:string) {
      const newSentFormat = sentFormat.SENT.find(s=>s.id == SentId)
      if (newSentFormat){
        this.sentFormat.push(newSentFormat)
      }
  },

  addNewSentFormat(newSentFormat:SentFormat){
    this.sentFormat.push(newSentFormat)
  },


    removeSentFormat(SentId:string) {
      const removeSentFormat = sentFormat.SENT.find(s=>s.id == SentId)
      console.log(removeSentFormat)
      if (removeSentFormat){
        this.sentFormat = this.sentFormat.filter(t=>t.id != removeSentFormat.id)
        console.log(this.sentFormat)
      }
  },

    processReply(emailId: string, replyId: string) {
      const email = this.inbox.find(e => e.id === emailId);
      const reply = email?.replies?.find(r => r.id === replyId);

      if (!email || !reply) return;

      this.answeredEmail.push({
        ...email,
        from: 'player',
        to: [email.from],
        content: reply.text,
        isRead: true,
        metadata: { ...email.metadata }
      });

      if (!email.metadata.requiresAction) {
        this.inbox = this.inbox.filter(e => e.id !== emailId);
      }
    },


    markAsRead(emailId: string) {
      const email = this.inbox.find(e => e.id == emailId);
      if (email) {
        email.isRead = true;
      }
    }
  },

  getters: {
     getSubjectsByRecipient: (state) => (recipientId: string) => {
      return state.sentFormat.filter(mail => mail.relate.id === recipientId);
    },
    
    
    unreadCount: (state) => state.inbox.filter(e => !e.isRead).length,

    urgentEmails: (state) => state.inbox.filter(
      e => e.metadata.requiresAction && !e.isRead
    ),

    getContactName: (state) => (id: string) => 
      state.contacts.find(c => c.id === id)?.name || id
  },
  persist:true,
});