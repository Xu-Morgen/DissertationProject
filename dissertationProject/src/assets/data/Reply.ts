import Events from "./Events";
import type { Reply } from "../../stores/type";
import RecipientOfficer from "./RecipientOfficer";
import userTasks from "./userTasks";


const Reply1:Reply = {
    id: 0,
    relate: [RecipientOfficer.Recipient1.id],
    about: userTasks.Task1.subject,
    subject: "I'm here",
    content: [{label:"I'm Coming!",value:"I'm Coming!"},{label:"I'm Leaving!",value:"I'm Leaving!"}],
    Event:Events.Event1
}

const ReplyList = [Reply1]

export default {
    Reply1,
    ReplyList,
}