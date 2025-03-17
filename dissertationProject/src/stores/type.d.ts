import type { time } from "echarts/core";



interface Email {
    id:number;
    sender: string;
    subject: string;
    detail:string;
    time: string;
    type:"Task"|"Reply"|"Message"|"UserTask";
    typeContent?:Task|Reply|Sent|UserTask;
    Event:PlayerEvent;
    EventParam?:any;
}

interface SentEmail{
    id:number;
    SentTo:string[];
    subject:string;
    detail:string;
    type:"Sent";
}


interface Task {
    id:number;
    detail: string;
    relate?:string;
    isAccept:boolean;
    subject:string;
    isError?:boolean;
    isFinished:boolean;
    arrange:0|1|2|3|4 //0是未分配 1是must 2是should 3是can

    hiddenImportant:number;
    meetingTime?:time;
}

interface UserTask {
    id:number;
    detail: string;
    relate?:string;
    isAccept:boolean;
    subject:string;
    isFinished:boolean;
}

interface Reply {
    id:number;
    relate:number[];
    about: string;
    subject:string;
    content:{value:string,label:string}[];
    Event:PlayerEvent;
}

interface Sent{
    id:number;
    detail:string;
    to:string;
    relate?:Email;
}
  
interface Recipient{
    id:number;
    Name:string;
    job:string;
    color?:number;
    isUnlock:boolean;
}

interface PlayerEvent {
    id: number;
    name: string;
    action: (payload?: any) => void;
}