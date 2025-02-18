import type { time } from "echarts/core";


interface Email {
    id:number;
    sender: string;
    subject: string;
    detail:string;
    time: string;
    type:"Task"|"Reply"|"Sent";
    typeContent?:Task|Reply|Sent;
}

interface Task {
    detail: string;
    relate?:string;
    isAccept:boolean;
    subject:string;

    hiddenImportant:number;
    meetingTime?:time;
}

interface Reply {
    detail: string;
    relate:Email;
}

interface Sent{
    detail:string;
    to:string;
    relate?:Email;
}
  