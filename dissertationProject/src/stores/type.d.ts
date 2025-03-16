import type { time } from "echarts/core";



interface Email {
    id:number;
    sender: string;
    subject: string;
    detail:string;
    time: string;
    type:"Task"|"Reply"|"Sent"|"Message";
    typeContent?:Task|Reply|Sent;
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

interface Reply {
    detail: string;
    relate:Email;
}

interface Sent{
    detail:string;
    to:string;
    relate?:Email;
}
  
interface Recipient{
    id:number;
    Name:String;
    job:String;
    color?:number;
}