import type { Email, Reply, Sent, Task } from "../../stores/type";
import Tasks from "../../assets/data/task.ts"

export const emailList: Email[] = [
    {
      id: 1,
      sender: "alice@example.com",
      subject: "Task 1: Complete the report",
      detail: "Please complete the report by the end of the day.",
      time: "2025-02-18T09:00:00Z",
      type:"Task",
      typeContent: Tasks.Task1,
    },
    {
      id: 2,
      sender: "bob@example.com",
      subject: "Reply: Regarding Task 1",
      detail: "I have completed the report and submitted it.",
      time: "2025-02-18T10:00:00Z",
      type:"Reply",
      typeContent: {
        detail: "I have completed the report and submitted it.",
        relate: {
          id: 1,
          sender: "alice@example.com",
          subject: "Task 1: Complete the report",
          detail: "Please complete the report by the end of the day.",
          time: "2025-02-18T09:00:00Z",
          type:"Task",
        } as Email,
      } as Reply,
    },
    {
      id: 3,
      sender: "charlie@example.com",
      subject: "Sent: Invoice #1234",
      detail: "The invoice #1234 has been sent to the client.",
      time: "2025-02-18T11:00:00Z",
      type:"Sent",
      typeContent: {
        detail: "The invoice #1234 has been sent to the client.",
        to: "client@example.com",
      } as Sent,
    },
    {
      id: 4,
      sender: "david@example.com",
      subject: "Task 2: Schedule the meeting",
      detail: "Please schedule the meeting with the client for next week.",
      time: "2025-02-18T12:00:00Z",
      type:"Task",
      typeContent: {
        arrange:0,
        id:2,
        isFinished:false,
        detail: "Schedule the meeting with the client.",
        isAccept: true,
        subject: "Task 2: Schedule the meeting",
        hiddenImportant: 2, // Placeholder for meeting time
      } 
    },
    {
      id: 5,
      sender: "emily@example.com",
      subject: "Reply: Task 2 - Meeting Scheduled",
      detail: "The meeting has been scheduled for next Wednesday.",
      time: "2025-02-18T13:00:00Z",
      type:"Reply",
      typeContent: {
        detail: "The meeting has been scheduled for next Wednesday.",
        relate: {
          id: 4,
          sender: "david@example.com",
          subject: "Task 2: Schedule the meeting",
          detail: "Please schedule the meeting with the client for next week.",
          time: "2025-02-18T12:00:00Z",
          type:"Task",
        } as Email,
      } as Reply,
    },
  ];