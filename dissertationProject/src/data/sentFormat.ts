import type {  SentFormat } from "@/types"
import contacts from "./contacts";


const SENT: SentFormat[] = [
    {
        id: "first_reply",
        subject: "你妈啊，终于写到发邮件了",
        content: "发什么都行，我迫不及待想看看发件箱了",
        relate: contacts.CONTACTS[0],
        nextEventId:'finish_first_reply'
    },
    {
        id:'first_kanban',
        subject:"来活啦！",
        content:"哦哦哦哦哦",
        relate:contacts.CONTACTS[2],
        nextEventId:"finish_firsh_kanban"
    }
];

export default {SENT}