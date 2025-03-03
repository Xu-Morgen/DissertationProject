import { defineStore } from 'pinia';
import type { Email, Task } from './type';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        user: null,
        token: '',
        progress: 0,
        newMails: 0,
        emails: []  as Email[],//总邮件列表
        currentEmail:{} as Email, //当前正在查看的email
        currentDay: 1, // 新增当前天数

        //用于Kanban
        tasks: [] as Task[], // 定义为 Task 数组
        finishedTasks:[]as number[],
        unarrangedTask:[] as number[], //未分配任务
        mustTask:[]  as number[],//Task列表1
        shouldTask:[]  as number[],//Task列表2
        canTask:[]  as number[],//Task列表3

        SpringTask:[] as number[],//在本次Spring中期望完成的任务

        ErrorTask:[] as number[],//遭遇事件暂时无法处理的问题

        //用于会议
        meetingInProgress: false, // 新增会议状态
        meetingVariables: {} as Record<string, number>, // 新增会议影响变量
        clickedEvents: [] as number[],


    }),
    actions: {
        syncMeetingState() {
            if (typeof window !== 'undefined') {
              window.addEventListener('storage', (event) => {
                if (event.key === 'pinia-global') {
                  this.$hydrate();
                }
              });
            }
        },
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
        setCurrentEmail(current:Email){
            this.currentEmail = current 
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
            this.shouldTask = [];
            this.canTask = [];
            this.mustTask = [];
        },
        
        addFinishedTask(index:number){ //添加已完成任务
            this.tasks[index].isFinished = true
        },
        // 更新任务优先级
        updateTaskPriority(taskId: number, priority: 0 | 1 | 2 | 3 | 4) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                task.arrange = priority;
            }
        
            // 同步更新优先级列表
            if (priority === 1) {
                // 如果 taskId 不在 mustTask 中，则添加
                if (!this.mustTask.includes(taskId)) {
                    this.mustTask.push(taskId);
                }
            } else if (priority === 2) {
                // 如果 taskId 不在 shouldTask 中，则添加
                if (!this.shouldTask.includes(taskId)) {
                    this.shouldTask.push(taskId);
                }
            } else if (priority === 3) {
                // 如果 taskId 不在 canTask 中，则添加
                if (!this.canTask.includes(taskId)) {
                    this.canTask.push(taskId);
                }
            } else if (priority === 0) {
                // 在 priority 为 0 时，移除 taskId
                this.mustTask = this.mustTask.filter(t => t !== taskId);
                this.shouldTask = this.shouldTask.filter(t => t !== taskId);
                this.canTask = this.canTask.filter(t => t !== taskId);
            }

            
        },
        
        // 新增会议相关actions
        setMeetingInProgress(status: boolean) {
            this.meetingInProgress = status;
        },
        updateMeetingVariable(payload: { key: string; value: number }) {
            this.meetingVariables[payload.key] = 
                (this.meetingVariables[payload.key] || 0) + payload.value;
        },
        resetMeetingState() {
            this.meetingInProgress = false;
            this.meetingVariables = {};
        },
        // 新增天数相关actions
        setCurrentDay(day: number) {
            this.currentDay = day;
        },
        nextDay() {
            this.currentDay++;
        },
        prevDay() {
            this.currentDay = Math.max(1, this.currentDay - 1);
        },
        // 修改点击标记方法
        markEventClicked(eventId: number) {
            if (!this.clickedEvents.includes(eventId)) {
            this.clickedEvents.push(eventId);
            }
        },
        resetClickedEvents() {
            this.clickedEvents = [];
        }
        

    },
    persist: true, // 持久化存储
});
