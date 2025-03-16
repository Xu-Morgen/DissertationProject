import { onMounted } from 'vue';
import { useGlobalStore } from '../stores/global';
import { useGameConfig } from '../stores/config';
import mail from "../assets/data/mail";

const checkFirstTimePlay = () => {
    const config = useGameConfig();
    const store = useGlobalStore();

    if(config.firstTime == true){
        config.setFirstTime(false);
        store.addMail(mail.Email1);
    }
}



export default {
    checkFirstTimePlay
}
