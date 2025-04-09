import type {  SentFormat } from "@/types"
import contacts from "./contacts";


const SENT: SentFormat[] = [
    {
        id: "first_reply",
        subject: "first email",
        content: "Report to the boss, I have arrived at my workstation",
        relate: contacts.CONTACTS['boss'],
        nextEventId: 'finish_first_reply',
        type: "normal"
    },
    {
        id: 'first_kanban',
        subject: "Kanban content verification",
        content: "Scrum Team, please note that I have added the latest task to the correct location in Kanban",
        relate: contacts.CONTACTS['team'],
        nextEventId: "finish_firsh_kanban",
        type: "normal"
    },   
    {
        id: 'make_meeting',
        subject: "Orientation party",
        content: "It's time to meet you all.",
        relate: contacts.CONTACTS['team'],
        type: "meeting",
        meetingid:'fresher_meeting'
    },

];

export default {SENT}