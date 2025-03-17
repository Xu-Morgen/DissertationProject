import type { PlayerEvent, Recipient } from "../../stores/type";
import { useGlobalStore } from "../../stores/global";
import { useUserTasks } from "../../stores/userTask";
import userTasks from "./userTasks";
import { useEmails } from "../../stores/emails";
import RecipientOfficer from "./RecipientOfficer";
import Reply from "./Reply";

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

const Event1:PlayerEvent={
    id:2,
    name:"sned to boss",
    action:function():void{
        const usertasks = useUserTasks()
        usertasks.finishTask(userTasks.Task1.id)
        const emaillist = useEmails()
        console.log(123)
        emaillist.removeReplyCanUse(Reply.Reply1.id)
        console.log(Reply.Reply1.id)
    }
}

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



export default {
    EmptyEvent,
    addReceiver,
    Event1,
    Event2
};
