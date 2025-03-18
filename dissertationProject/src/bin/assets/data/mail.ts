import Events from './Events'
import type { Email, Task } from "../../stores/type";
import Tasks from './task'

import Recipient from './RecipientOfficer'

import UserTasks from './userTasks'
const Email1:Email = {
    id: 0,
    sender: "System",
    subject: "Welcome to The Game",
    detail: `
    Hello, we've been waiting for you for a long time.

        This project has entered a dangerous stage. Development delays, staff departures, communication confusion... If we don't do something, it will become another failure case.

        You are the key to saving this project.

        Your first task is to familiarize yourself with our communication tools. The email system is the only information flow we can control, and the task board (Kanban) is your weapon to manage everything.

        Your first action:
        ✅ Read this email to understand the background.
        ✅ Open your task board (Kanban) to view your first task.
        ✅ Reply to this email to let me know that you have arrived.

    You must adapt quickly. We don't have time to waste.`,
    time: "2020.1.1",
    type: "UserTask",
    typeContent: UserTasks.Task1,
    Event: Events.Event2,
    EventParam:Recipient.Recipient1,
}

const Email2:Email = {
    id: 1,
    sender: "Boss",
    subject: "The First Meeting",
    detail: `
    I am very happy to see your quick report at this time. Now please organize an emergency meeting so that the members of the group can get to know you.`,
    time: "2020.1.1",
    type: "UserTask",
    typeContent: UserTasks.Task1,
    Event: Events.Event3,
    EventParam:Recipient.Recipient2,
}

export default {
    Email1,
    Email2,
}