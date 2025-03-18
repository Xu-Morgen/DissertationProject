// stores/gameConfigStore.ts
import { defineStore } from 'pinia';


export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

interface GameConfigState {
  isFirstTime: boolean;
  currentTheme: ThemeMode;
  language: string;
}

export const useGameConfigStore = defineStore('gameConfig', {
  state: (): GameConfigState => ({
    isFirstTime: true,
    currentTheme: ThemeMode.System,
    language: navigator.language || 'en-US',

  }),
  actions: {
    // 初始化设置
    initializeSettings(payload: Partial<GameConfigState>) {
      this.$patch(payload);
      this.isFirstTime = false;
    },


    // 主题切换
    switchTheme(newTheme: ThemeMode) {
      this.currentTheme = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
    },



    // 重置为默认设置
    resetToDefaults() {
      this.$reset();
    }
  },
  persist: true
});