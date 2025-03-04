<template>
    <div class="meeting-room">
      <div class="chat-log">
        <div v-for="(message, index) in chatHistory" :key="index" class="sys-message">
          {{ message }}
        </div>
      </div>
      <div class="player-options">
        <a-button 
          v-for="(option, index) in currentOptions" 
          :key="index"
          @click="selectOption(option)"
        >
          {{ option.text }}
        </a-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  interface ScriptStep {
    sys: string;
    options: Array<{
      text: string;
      effects?: Record<string, any>;
    }>;
  }
  
  // 示例剧本数据
  const sampleScripts: Record<number, ScriptStep[]> = {
    1: [
      { 
        sys: "系统：欢迎来到紧急会议！",
        options: [
          { text: "保持沉默", effects: { tension: +10 } },
          { text: "主动发言", effects: { trust: +5 } }
        ]
      },
      {
        sys: "同事：我们需要立即行动！",
        options: [
          { text: "同意方案", effects: { progress: +20 } },
          { text: "提出异议", effects: { tension: +15 } }
        ]
      },
      {
        sys: "系统：会议结束",
        options: [
          { text: "结束", effects: { progress: +20 } },
        ]
      }
    ]
  };
  
  import { useGlobalStore } from '../../stores/global';


    const route = useRoute();
    const globalStore = useGlobalStore();


  const currentStep = ref(0);
  const chatHistory = ref<string[]>([]);
  const currentOptions = ref<ScriptStep['options']>([]);
  const totalSteps = ref(0); // 新增总步骤数

    // 移除localStorage操作，改为store操作
    onMounted(() => {
    globalStore.setMeetingInProgress(true);
    loadScript(); // 这里明确调用了 loadScript
    });

    onUnmounted(() => {
    // 仅在完成时清除状态
    if (currentStep.value >= totalSteps.value) {
        globalStore.resetMeetingState();
    }
    });

    

    const loadScript = () => {
    const eventId = Number(route.params.id);
    const script = sampleScripts[eventId] || [];
    totalSteps.value = script.length; // 设置总步骤数
    if (script.length > 0) {
        proceedStep(script[0]);
    }
    };
    
  const proceedStep = (step: ScriptStep) => {
    chatHistory.value.push(step.sys);
    currentOptions.value = step.options;
  };
  
    // 修改selectOption函数
    const selectOption = (option: ScriptStep['options'][number]) => {
    if (option.effects) {
        Object.entries(option.effects).forEach(([key, value]) => {
        globalStore.updateMeetingVariable({ key, value });
        });
    }

    // 增加步骤处理
    currentStep.value++;
    
    const eventId = Number(route.params.id);
    const script = sampleScripts[eventId] || [];

    if (currentStep.value < totalSteps.value) {
        proceedStep(script[currentStep.value]);
    } else {
        // 会议完成处理
        globalStore.setMeetingInProgress(false);
        setTimeout(() => window.close(), 1000); // 添加延迟确保状态更新
    }
    };
  </script>
  
  <style scoped>
  .meeting-room {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .chat-log {
    min-height: 300px;
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .sys-message {
    margin: 10px 0;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
  }
  
  .player-options {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
  </style>