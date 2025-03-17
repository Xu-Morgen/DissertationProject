import { defineStore } from 'pinia';
import type { UserTask } from './type';
//用于用户任务
export const useUserTasks = defineStore('userTasks', {
    state: (): UserTasksState => ({
        tasks: [],
    }),
    actions: {
        addTask(task:UserTask){
            task.isAccept = true;
            this.tasks.push(task);
        }
    },
    persist: true, // 持久化存储
});

interface UserTasksState {
    tasks: UserTask[];
}