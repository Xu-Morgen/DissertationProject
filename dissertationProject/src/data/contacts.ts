import type { Recipient } from "@/types";

const CONTACTS: Record<string,Recipient> =  {
    boss:{
        id: 'boss',
        name: 'Boss',
    },
    client:{
        id: 'client',
        name: 'client',
    },
    team:{
        id: 'team',
        name: 'ScrumTeam',
    }
}

export const EMERGENCY_CONTACTS:Record<string,Recipient> = {
    cto: {
      id: 'cto',
      name: '首席技术官 (CTO)'
    },
    devops: {
      id: 'devops',
      name: '运维团队'
    },
    security_lead: {
      id: 'security_lead',
      name: '安全负责人'
    }
  };
  

export default {CONTACTS}