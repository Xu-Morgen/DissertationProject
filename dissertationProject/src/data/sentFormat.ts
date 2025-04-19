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

export const EMERGENCY_FORMATS = {
    server_emergency: {
      id: "emergency_server",
      subject: "[ermergency] server killed",
      content: `do someting`,
      relate: { id: "devops", name: "devops" },
      type: "emergency",
      meetingid: "tech_emergency",
      nextEventId: "trigger_tech_meeting",
      emergencyLevel: 1
    },
    security_emergency: {
      id: "emergency_security",
      subject: "[紧急] 安全漏洞处理",
      content: `## 安全漏洞应急方案
        1. 隔离受影响系统
        2. 启动漏洞修复流程
        3. 安排安全审计会议`,
      relate: { id: "security", name: "安全团队" },
      type: "emergency",
      meetingid: "security_meeting",
      nextEventId: "trigger_security_meeting",
      emergencyLevel: 2
    }
  };

export default {SENT}