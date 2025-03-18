import { GAME_EVENTS } from "@/data/events";
import { TASK_TEMPLATES } from "@/data/tasks";

export function validateEvents() {
    const missingTemplates = [];
  
    // 验证所有事件引用的任务模板存在
    for (const [eventId, event] of Object.entries(GAME_EVENTS)) {
      for (const action of event.actions) {
        if (action.type === 'add_task' && !TASK_TEMPLATES[action.taskId]) {
          missingTemplates.push({
            eventId,
            taskId: action.taskId
          });
        }
      }
    }
  
    if (missingTemplates.length > 0) {
      console.error('缺失的任务模板:', missingTemplates);
      return false;
    }
    return true;
  }
  
//   // 在应用初始化时调用
//   validateEvents();