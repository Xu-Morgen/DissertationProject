import { defineStore } from 'pinia';
import type { Email, Task } from './type';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        user: null,
        token: '',
        progress: 0,
        newMails: 0,
        tasks: [] as Task[], // 定义为 Task 数组
        emails: []  as Email[],
    }),
    actions: {
        setUser(user: any) {
            this.user = user;
        },
        setToken(token: string) {
            this.token = token;
        },
        setProgress(progress: number) {
            this.progress = progress;
        },
        setMails(newMails: number) {
            this.newMails = newMails;
        },
        addTask(task: Task) { // 添加任务
            this.tasks.push(task);
        },
        removeTask(index: number) { // 按索引删除任务
            if (index >= 0 && index < this.tasks.length) {
                this.tasks.splice(index, 1);
            }
        },
        clearTasks() { // 清空任务
            this.tasks = [];
        }
    },
    persist: true, // 持久化存储
});
