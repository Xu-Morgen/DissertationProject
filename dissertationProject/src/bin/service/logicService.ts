import { onMounted } from 'vue';
import { useGlobalStore } from '../stores/global';
import { useGameConfig } from '../stores/config';
import { useEmails } from '../stores/emails';

import mail from "../assets/data/mail";

const checkFirstTimePlay = () => {
    const config = useGameConfig();
    const store = useGlobalStore();
    const emails = useEmails();
    if(config.firstTime == true){
        config.setFirstTime(false);
        emails.addMail(mail.Email1);
    }
}



export default {
    checkFirstTimePlay
}
