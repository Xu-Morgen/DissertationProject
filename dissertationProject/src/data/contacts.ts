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

export default {CONTACTS}