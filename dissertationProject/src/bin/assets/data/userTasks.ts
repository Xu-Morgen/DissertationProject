import type { UserTask } from "../../stores/type";

const Task1:UserTask = {
    id: 0,
    detail: "Reply to this email to let me know that you have arrived",
    isAccept: false,
    subject: "Reply to Boss",
    isFinished: false,
    isShown:true,
} 

const Task2:UserTask = {
    id: 1,
    detail: "Send an invitation to the meeting to the team members",
    isAccept: false,
    subject: "Send a meeting",
    isFinished: false,
    isShown:true,
} 

const makeTeammatesMeeting:UserTask = {
    id: 2,
    detail: "make meeting with teammates",
    isAccept: false,
    subject: "make meeting",
    isFinished: false,
    isShown:false,
}

export default {
    Task1,
    Task2,
    makeTeammatesMeeting
}