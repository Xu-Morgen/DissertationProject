import { defineStore } from 'pinia';
//用于游戏设置
export const useGameConfig = defineStore('config', {
    state: (): GameConfigState => ({
        firstTime: true,
    }),
    actions: {
        setFirstTime(value:boolean){
            this.firstTime = value
        }
    },
    persist: true, // 持久化存储
});

interface GameConfigState {
    firstTime: boolean;
}