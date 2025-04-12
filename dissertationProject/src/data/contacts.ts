import type { Recipient } from "@/types";

const CONTACTS: Record<string,Recipient> =  {
    boss:{
        id: 'boss',
        name: 'Boss',
        isEmergency:false,
    },
    client:{
        id: 'client',
        name: 'client',
        isEmergency:false,
    },
    team:{
        id: 'team',
        name: 'ScrumTeam',
        isEmergency:false,
    },
    cto: {
      id: 'cto',
      name: '首席技术官 (CTO)',
      isEmergency:true,
    },
    devops: {
      id: 'devops',
      name: '运维团队',
      isEmergency:true,
    },
    security_lead: {
      id: 'security_lead',
      name: '安全负责人',
      isEmergency:true,
    }
}


export default {CONTACTS}