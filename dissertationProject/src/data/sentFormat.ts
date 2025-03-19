import type {  SentFormat } from "@/types"
import contacts from "./contacts";


const SENT: SentFormat[] = [
    {
        id: "first_reply",
        subject: "你妈啊，终于写到发邮件了",
        content: "发什么都行，我迫不及待想看看发件箱了",
        relate: contacts.CONTACTS[0],
        nextEventId: 'finish_first_reply',
        type: "normal"
    },
    {
        id: 'first_kanban',
        subject: "来活啦！",
        content: "哦哦哦哦哦",
        relate: contacts.CONTACTS[2],
        nextEventId: "finish_firsh_kanban",
        type: "normal"
    },   
    {
        id: 'make_meeting',
        subject: "会议安排",
        content: "我们不得不举行一个会议",
        relate: contacts.CONTACTS[2],
        type: "meeting",
        meetingid:'fresher_meeting'
    },

];

export default {SENT}