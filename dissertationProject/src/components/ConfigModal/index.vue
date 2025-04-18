<script lang="ts" setup>
//用于在游戏设置当中时弹出的页面

import { useRouter } from 'vue-router';
import {useCalendarStore,useEmailStore,useEventStore,useRootStore,useTaskStore,useUIStore} from "@/stores/index"
import meetings from '@/data/meetings';
import tasks from '@/data/tasks';
import { notification } from 'ant-design-vue';
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
    title: "client ask: system update",
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
    message: 'test client task add',
    description: `connet to【${customerMeeting.title}】`,
    placement: 'bottomRight'
  });
};

// 新增紧急事件测试方法
const testEmergency = () => {
  const taskStore = useTaskStore()

  try {
    // 获取第一个客户任务作为基准任务
    const baseTask = taskStore.backlog.find(t => t.isCustomerTask);
    
    if (!baseTask) {
      notification.error({
        message: 'test failed',
        description: 'create client task first',
        placement: 'bottomRight'
      });
      return;
    }

    // 生成突发事件任务
    taskStore.generateEmergencyTask({
      emergencyId: 'server_down',  // 使用预定义的紧急事件模板
      baseTaskId: baseTask.id,
    });

    notification.success({
      message: 'emergency task added',
      description: `
        create：
        1. emergency personal task
        2. emergency recipient
        3. emergency meeting
      `,
      placement: 'bottomRight'
    });

  } catch (error) {
    console.error('紧急事件测试失败:', error);
    notification.error({
      message: '测试失败',
      description: '生成紧急事件时发生错误',
      placement: 'bottomRight'
    });
  }
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


      <a-button danger @click = "resetGame()">reset game</a-button>
      <a-button danger @click = "testmeeting()">add meeting and addRecipient</a-button>
      <a-button danger @click = "quickMeeting">add fresh meeting</a-button>
      <a-button danger @click = "quickTask">quick add client task</a-button>
      <a-button danger @click = "quickUnlockND">unlock next day</a-button>
      <a-button danger @click = "testCustomerTask">test client meeting generataion</a-button>
            
      <a-button danger @click="testEmergency">
        test emergency task
      </a-button>

    </p>
  </a-modal>
</template>