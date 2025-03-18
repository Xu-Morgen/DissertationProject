
import type { Recipient } from "../../stores/type";

const Recipient1:Recipient = {
    id: 0,
    Name: "Boss",
    job: "Boss",
    isUnlock:true,
}

const Recipient2:Recipient = {
    id:1,
    Name:"Scrum Team",
    job:"worker",
    isUnlock:false,
}

const Recipients = [Recipient1,Recipient2]

export default {
    Recipient1,
    Recipient2, 
    Recipients
}