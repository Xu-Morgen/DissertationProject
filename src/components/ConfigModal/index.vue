<script lang="ts" setup>

import { useRouter } from 'vue-router';
import {useCalendarStore,useEmailStore,useEventStore,useRootStore,useTaskStore,useUIStore} from "@/stores/index"
import meetings from '@/data/meetings';
import tasks from '@/data/tasks';
import { notification } from 'ant-design-vue';
import { EMERGENCY_TEMPLATES } from '@/data/emergency';

const router = useRouter();


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
  
  let customerMeeting = {
    ...meetings.CUSTOMER_MEETINGS[0], 
    id: `cust_meeting_${Date.now()}`
  };
  

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
  
  useCalendarStore().scheduleMeeting(customerMeeting, useCalendarStore().currentDay+1);


  notification.success({
    message: 'test client task add',
    description: `connet to【${customerMeeting.title}】`,
    placement: 'bottomRight'
  });
};


const day20 = () =>{
  const calendar = useCalendarStore()
  calendar.currentDay = 20
}


const triggerEmergency = () => {
  const taskStore = useTaskStore()
  taskStore.generateEmergencyTaskFrom(EMERGENCY_TEMPLATES['server_crash']);

};


const triggerEmergency2 = () =>{
  const taskStore = useTaskStore()
  taskStore.generateEmergencyTaskFrom(EMERGENCY_TEMPLATES['staff_sick_leave'])
}


const emit = defineEmits(["update:open"]);


const handleCancel = () => {
  emit("update:open", uiStore.toggleConfig(false));
};

const gosurvey  = () =>{
  router.push('/survey');
}
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
      <a-button danger @click="triggerEmergency">Test emergency tasks</a-button>
      <a-button danger @click="triggerEmergency2">Test emergency tasks2</a-button>
      <a-button danger @click="day20">day 20</a-button>
      <a-button danger @click="gosurvey">go survey</a-button>



    </p>
  </a-modal>
</template>