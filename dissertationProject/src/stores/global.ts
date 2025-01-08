import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        user: null,
        token: '',
        progress: 0,
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
    },
});
