<script lang="ts" setup>
//用于在游戏设置当中时弹出的页面

import { useRouter } from 'vue-router';
import {useCalendarStore,useEmailStore,useEventStore,useRootStore,useTaskStore,useUIStore} from "@/stores/index"
import meetings from '@/data/meetings';
import tasks from '@/data/tasks';
import { notification } from 'ant-design-vue';
import { GAME_EVENTS } from '@/data/events';
const router = useRouter();


// 接收外部传入的 `open` 状态和 `Content`
const props = defineProps<{
  open: boolean;
}>();

const uiStore = useUIStore();

const resetGame = () =>{
    useCalendarStore().$reset()
    useEmailStore().$reset()
    useEventStore().$reset()
    useTaskStore().$reset()
    useUIStore().$reset()
    useRootStore().$reset()
    router.replace({ path: '/' });
}

const testmeeting = () =>{
  useCalendarStore().addMeetingCanUse('fresher_meeting',meetings.FRESH_MEETINGS)
  useEmailStore().addRecipient('team')
  useEmailStore().addSentFormat('make_meeting')
}

const quickMeeting = ()=>{
  const {completed,day,...newEvent} = meetings.FRESH_MEETINGS[0]
  useCalendarStore().scheduleMeeting(newEvent,0)
}

const quickTask = ()=>{
  const newTask = tasks.TASK_TEMPLATES['test']
  useTaskStore().upsertTask({...newTask,id: `email_${Date.now()}`,
    createdAt: useCalendarStore().currentDay})
}

const quickUnlockND = () =>{
  useUIStore().toggleNextDatBtn(true)
}

const testCustomerTask = () => {
  // 先创建一个测试客户会议
  let customerMeeting = {
    ...meetings.CUSTOMER_MEETINGS[0], 
    id: `cust_meeting_${Date.now()}`
  };
  

  // 生成关联的客户任务
  const {mainTask} = useTaskStore().generateCustomerTask({
    meetingId: customerMeeting.id,
    title: "紧急客户需求：支付系统升级",
    dueDay: 3,
    storyPoints: 8
  });

  customerMeeting = meetings.customCustomerMeeting({
    id: customerMeeting.id,
    title: mainTask.title,
    taskIsComplete: mainTask
  })
  
  console.log(mainTask.id,customerMeeting.id)
  console.log(mainTask)
  console.log(customerMeeting)

  // 安排到测试日
  useCalendarStore().scheduleMeeting(customerMeeting, useCalendarStore().currentDay+1);


  notification.success({
    message: '测试客户任务已创建',
    description: `已关联到会议【${customerMeeting.title}】`,
    placement: 'bottomRight'
  });
};


// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open"]);


const handleCancel = () => {
  emit("update:open", uiStore.toggleConfig(false));
};
</script>

<template>
  <a-modal
    :open="open"
    title="Game Config"
    @ok="handleCancel"
    @cancel="handleCancel"
    destroyOnClose
  >
    <p>
      <!-- 在现有按钮后添加 -->
      
      <!-- 原有其他按钮... -->
      <a-button danger @click = "resetGame()">reset game</a-button>
      <a-button danger @click = "testmeeting()">添加会议选项和联络人</a-button>
      <a-button danger @click = "quickMeeting">快速添加一场迎新会</a-button>
      <a-button danger @click = "quickTask">快速添加一个客户任务</a-button>
      <a-button danger @click = "quickUnlockND">快速解锁下一天</a-button>
      <a-button danger @click = "testCustomerTask">测试客户任务生成</a-button>

    </p>
  </a-modal>
</template>