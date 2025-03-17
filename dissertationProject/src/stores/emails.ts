import { defineStore } from 'pinia';
import type { Email } from './type';
//用于邮件设置
export const useEmails = defineStore('emails', {
    state: (): emailStates => ({
    newMails: 0,

    emails: []  as Email[],//总邮件列表
    currentEmail:{} as Email, //当前正在查看的email
    sentEmails:[] as Email[],//发件箱
        
    }),
    actions: {
        //邮件部分
        addMail(newMail:Email){
            this.emails.push(newMail)
        },
        clearMails(){
            this.emails = []
        },
        setCurrentEmail(current:Email){
            this.currentEmail = current 
        },
    },
    persist: true, // 持久化存储
});

interface emailStates {
    newMails: number,
    emails:Email[],
    currentEmail:Email,
    sentEmails:Email[],
}