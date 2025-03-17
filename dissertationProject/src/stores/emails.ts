import { defineStore } from 'pinia';
import type { Email, Reply, SentEmail } from './type';
//用于邮件设置
export const useEmails = defineStore('emails', {
    state: (): emailStates => ({
    newMails: 0,

    emails: []  as Email[],//总邮件列表
    currentEmail:{} as Email|SentEmail, //当前正在查看的email
    sentEmails:[] as SentEmail[],//发件箱
    replyCanUse:[] as number[],
        
    }),
    actions: {
        //邮件部分
        addMail(newMail:Email){
            this.emails.push(newMail)
        },
        clearMails(){
            this.emails = []
        },
        setCurrentEmail(current:Email|SentEmail){
            this.currentEmail = current 
        },
        addSentEmails(sent:SentEmail){
            this.sentEmails.push(sent)
        },
        addReplyCanUse(Reply:number){
            this.replyCanUse.push(Reply)
        },
        removeReplyCanUse(ReplyId:number){

            this.replyCanUse = this.replyCanUse.filter(r=>r != ReplyId)

        }
    },
    persist: true, // 持久化存储
});

interface emailStates {
    newMails: number,
    emails:Email[],
    currentEmail:Email|SentEmail,
    sentEmails:SentEmail[],
    replyCanUse: number[],
}