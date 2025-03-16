<template>
  <div class="meeting-room">
    <div class="chat-log">
      <div 
        v-for="(message, index) in chatHistory" 
        :key="index"
        :class="['message-bubble', message.type]"
      >
        {{ message.content }}
      </div>
    </div>
    <div class="player-options" v-if="currentOptions.length > 0">
      <a-button 
        v-for="(option, index) in currentOptions" 
        :key="index"
        @click="selectOption(option)"
        class="option-button"
      >
        {{ option.text }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '../../stores/global';

interface ScriptStep {
  sys: string;
  options?: Array<{ // 改为可选属性
    text: string;
    effects?: Record<string, any>;
  }>;
}

interface ChatMessage {
  type: 'system' | 'user';
  content: string;
}

// 示例剧本数据
const sampleScripts: Record<number, ScriptStep[]> = {
  1: [
    {
      sys:"test1"
    },
    { 
      sys: "speeker1：test2！",
      options: [
        { text: "action1", effects: { tension: +10 } },
        { text: "action2", effects: { trust: +5 } }
      ]
    },
    {
      sys: "speeker2：test3！",
      options: [
        { text: "action3", effects: { progress: +20 } },
        { text: "action4", effects: { tension: +15 } }
      ]
    },
    {
      sys: "end"
      // 没有options将自动继续
    }
  ]
};

const route = useRoute();
const globalStore = useGlobalStore();

const currentStep = ref(0);
const chatHistory = ref<ChatMessage[]>([]);
const currentOptions = ref<ScriptStep['options']>([]);
const totalSteps = ref(0);

onMounted(() => {
  globalStore.setMeetingInProgress(true);
  loadScript();
});

onUnmounted(() => {
  if (currentStep.value >= totalSteps.value) {
    globalStore.resetMeetingState();
  }
});

const loadScript = () => {
  const eventId = Number(route.params.id);
  const script = sampleScripts[eventId] || [];
  totalSteps.value = script.length;
  
  if (script.length > 0) {
    proceedStep(script[0]);
  }
};

const proceedStep = (step: ScriptStep) => {
  // 添加系统消息
  chatHistory.value.push({
    type: 'system',
    content: step.sys
  });

  if (step.options && step.options.length > 0) {
    currentOptions.value = step.options;
  } else {
    // 没有选项时自动继续
    autoProceed();
  }
};

const selectOption = (option: ScriptStep['options'][number]) => {
  // 添加玩家选择消息
  chatHistory.value.push({
    type: 'user',
    content: `you choose：${option.text}`
  });

  // 处理效果
  if (option.effects) {
    Object.entries(option.effects).forEach(([key, value]) => {
      globalStore.updateMeetingVariable({ key, value });
    });
  }

  currentStep.value++;
  const eventId = Number(route.params.id);
  const script = sampleScripts[eventId] || [];

  if (currentStep.value < totalSteps.value) {
    // 延迟显示下一条系统消息
    setTimeout(() => proceedStep(script[currentStep.value]), 500);
  } else {
    completeMeeting();
  }
};

const autoProceed = () => {
  currentStep.value++;
  const eventId = Number(route.params.id);
  const script = sampleScripts[eventId] || [];

  if (currentStep.value < totalSteps.value) {
    setTimeout(() => proceedStep(script[currentStep.value]), 1000);
  } else {
    completeMeeting();
  }
};

const completeMeeting = () => {
  globalStore.setMeetingInProgress(false);
  setTimeout(() => window.close(), 1000);
};
</script>

<style scoped>
.meeting-room {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.chat-log {
  min-height: 400px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  word-break: break-word;
}

.message-bubble.system {
  background: #f1f3f5;
  align-self: flex-start;
}

.message-bubble.user {
  background: #4dabf7;
  color: white;
  align-self: flex-end;
}

.player-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.option-button {
  flex: 1;
  min-width: 200px;
  transition: transform 0.2s;
}

.option-button:hover {
  transform: translateY(-2px);
}
</style>