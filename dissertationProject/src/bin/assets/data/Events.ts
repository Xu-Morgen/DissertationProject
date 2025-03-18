import type { Email, PlayerEvent, Recipient } from "../../stores/type";
import { useGlobalStore } from "../../stores/global";
import { useUserTasks } from "../../stores/userTask";
import userTasks from "./userTasks";
import { useEmails } from "../../stores/emails";
import RecipientOfficer from "./RecipientOfficer";
import Reply from "./Reply";
import Emails from "./mail"

//为垃圾邮件准备的无事件邮件
const EmptyEvent:PlayerEvent={
    id: 0,
    name: "empty",
    action: function (payload?: any): void {
        console.log(payload,"event trigger")
    }
}


const addReceiver:PlayerEvent={
    id:1,
    name:"add receiver",
    action:function(receiver:Recipient):void{
        const store = useGlobalStore()
        receiver.isUnlock = true
        store.addRecipients(receiver)
    }
}

//为Task1的回复邮件准备的事件
const Event1:PlayerEvent={
    id:2,
    name:"send to boss",
    action:function():void{
        const usertasks = useUserTasks()
        usertasks.finishTask(userTasks.Task1.id)
        const emaillist = useEmails()
        emaillist.removeReplyCanUse(Reply.Reply1.id)
        addEmail(Emails.Email2)
    }
}

//为提出Task1准备的事件
const Event2:PlayerEvent={
    id:3,
    name:"add boss receiver",
    action:function():void{
        const store = useGlobalStore()
        const receiver =  RecipientOfficer.Recipient1
        receiver.isUnlock = true
        store.addRecipients(receiver)

        const emaillist = useEmails()
        emaillist.addReplyCanUse(Reply.Reply1.id)

    }
}

//为提出Task2准备的事件
const Event3:PlayerEvent={
    id:4,
    name:"add boss receiver",
    action:function():void{
        const store = useGlobalStore()
        const receiver =  RecipientOfficer.Recipient2
        receiver.isUnlock = true
        store.addRecipients(receiver)
        const emaillist = useEmails()
        emaillist.addReplyCanUse(Reply.Reply2.id)
    }
}

const addEmail = (email:Email) =>{
    const emaillist = useEmails();
    emaillist.addMail(email)
}



export default {
    EmptyEvent,
    addReceiver,
    Event1,
    Event2,
    Event3
};
