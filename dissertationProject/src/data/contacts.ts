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
      name: '(CTO)',
      isEmergency:true,
    },
    devops: {
      id: 'devops',
      name: 'tech team',
      isEmergency:true,
    },
    security_lead: {
      id: 'security_lead',
      name: 'security_lead',
      isEmergency:true,
    }
}


export default {CONTACTS}