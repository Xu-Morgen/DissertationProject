import type { PlayerEvent, Recipient } from "../../stores/type";
import { useGlobalStore } from "../../stores/global";
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


export default {
    EmptyEvent,
    addReceiver
};
