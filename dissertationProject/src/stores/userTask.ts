import { defineStore } from 'pinia';
import type { UserTask } from './type';
//用于用户任务
export const useUserTasks = defineStore('userTasks', {
    state: (): UserTasksState => ({
        tasks: [],
        finishedtask:[],
    }),
    actions: {
        addTask(task:UserTask){
            task.isAccept = true;
            this.tasks.push(task);
        },
        finishTask(id:number){
            if(!this.finishedtask.some(t=>t == id)){
                this.finishedtask.push(id)
            }

        }

    },
    persist: true, // 持久化存储
});

interface UserTasksState {
    tasks: UserTask[];
    finishedtask:number[];
}