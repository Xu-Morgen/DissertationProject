<template>
    <a-modal
      :open="open"
      title="Sent Email"
      @ok="handleSend"
      @cancel="handleCancel"
      destroyOnClose
      :styles="{ body: { maxHeight: '70vh' } }"
    >
      <!-- 收件人选择 -->
      <a-select
        v-model:value="selectedRecipient"
        placeholder="Select recipient"
        style="width: 100%; margin-bottom: 10px"
        :options="recipientOptions"
        show-search
        option-filter-prop="label"
      />


      <!-- 邮件主题选择 -->
        <a-select
        v-model:value="selectedSubject"
        placeholder="Select Subject"
        style="width: 100%; margin-bottom: 10px"
        :options="subjectOptions"
        mode='single'
        show-search
        option-filter-prop="label"
      />
  
      

      <!-- 邮件正文 -->
      <a-textarea
        v-model:value="emailContent"
        placeholder="Email text"
        :rows="6"
        style="width: 100%; margin-bottom: 10px"
        readonly
      />

      <!-- 下方是会议选项 -->
      <!--选择开会日期-->
      <div v-if = 'isMeeting' class="meeting-day">
      At Day :  &nbsp;
      <a-input-number
        
        v-model:value="meetingDay"
        placeholder="Please enter a number"
        :rows="6"
        style="width:30%; margin-bottom: 10px"
        :min="calendarStore.currentDay" :max="30"
      />
  
      </div>

      <!-- 会议主题选择 -->
      <a-select
        v-if = 'isMeeting'
        v-model:value="selectedMeeting"
        placeholder="Select Meeting Subject"
        style="width: 100%; margin-bottom: 10px"
        :options="meetingOptions"
        mode='single'
        show-search
        option-filter-prop="label"
      />
  

  
      <template #footer>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" @click="handleSend">Sent</a-button>
      </template>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useEmailStore, useTaskStore, useEventStore, useCalendarStore, useUIStore } from '@/stores';
  import { GAME_EVENTS } from '@/data/events';
  import type { Email, Recipient, SentFormat } from '@/types';

  const props = defineProps<{
    open: boolean;
  }>();
  
  const emit = defineEmits(['update:open']);
  
  const emailStore = useEmailStore();
  const taskStore = useTaskStore();
  const eventStore = useEventStore();
  const calendarStore = useCalendarStore();
  
  // 选中的收件人和主题
  const selectedRecipient = ref<string>();  
  const selectedSubject = ref<string>("");
  const emailContent = ref<string>("");
  let subject = ref<SentFormat[]>([]);
  const isMeeting = ref(false);
  const meetingDay = ref(0);
  const selectedMeeting = ref<string>();

  watch(selectedSubject,()=>{
    const chooseSubject = subject.value.find(t=>t.subject === selectedSubject.value)
    if (chooseSubject){
      if(chooseSubject.type === 'meeting'){
        isMeeting.value = true
      }
      else{
        isMeeting.value = false
      }
    }
  })

  watch(selectedRecipient, () => {
    // 清空表单内容
    selectedSubject.value = '';
    emailContent.value = '';
    isMeeting.value = false;
    meetingDay.value = 0;
    selectedMeeting.value = undefined;
  });
    
  //会议选项
  const meetingOptions = computed(()=>{
    const chooseSubject = subject.value.find(t=>t.subject === selectedSubject.value)
    if(chooseSubject){
      if(chooseSubject.meetingid){
        const filterlist = calendarStore.meetingCanUse.filter(m=>m.id == chooseSubject.meetingid)
        console.log(filterlist)
        return filterlist.map((c)=>({
          value:c.id,
          label:c.title,
        }))
      }
    }
    return []
  })



  // 收件人选项
  const recipientOptions = computed(() => 
    emailStore.contacts
      .map(c => ({
        value: c.id,
        label: c.name
      }))
  );
  
  // 主题选项
  const subjectOptions = computed(() => {
    console.log("sentFormat:", emailStore.sentFormat);
    console.log("selectedRecipient id:", selectedRecipient.value  );

    if (!selectedRecipient.value) return [];
    const recipientId = selectedRecipient.value; // 直接获取收件人 id
    subject.value = emailStore.getSubjectsByRecipient(recipientId);
    console.log(subject.value)
    return subject.value.map((c) => ({
      value: c.subject, 
      label: c.subject
    }));
  });



  
  // 自动变更主题内容
  watch(selectedSubject, (newSubject) => {
    const content = selectedSubject ? subject.value.find(t=>t.subject === selectedSubject.value)?.content : "";
    if(content){
      emailContent.value = content
    }

  });
  
  // 发送邮件
  const handleSend = () => {
    if (!validateForm()) return;
  //常规邮件发送流程
    if(subject.value.find(t=>t.subject === selectedSubject.value)?.type == 'normal'){
      const newEmail: Omit<Email, 'id' | 'isRead'> = {
      from: 'player',
      to: [selectedRecipient.value as string],
      subject: selectedSubject.value,
      content: emailContent.value,
      day: useCalendarStore().currentDay,
      replies: [],
      metadata: {
        requiresAction: false,
        category: 'system',
      },
    };
    // 添加邮件
    emailStore.sentEmail(newEmail);
  
    const format = subject.value.find(t=>t.subject === selectedSubject.value)
      if(format?.nextEventId){
        eventStore.triggerEvent(format.nextEventId, GAME_EVENTS);
      }
    }
  //会议邮件发送逻辑
    else if(subject.value.find(t=>t.subject === selectedSubject.value)?.type == 'meeting'){
    const newEmail: Omit<Email, 'id' | 'isRead'> = {
        from: 'player',
        to: [selectedRecipient.value as string],
        subject: selectedSubject.value,
        content: `${emailContent.value}<br><br>The meeting will be held at ${meetingDay.value}, and the theme of the meeting is ${selectedMeeting.value}.`,
        day: useCalendarStore().currentDay,
        replies: [],
        metadata: {
          requiresAction: false,
          category: 'system',
        },
      }
      emailStore.sentEmail(newEmail);
      const meetingfind = calendarStore.meetingCanUse.find(t=>t.id == selectedMeeting.value)
      if(meetingfind){
        const {day,completed,...event} = meetingfind
        console.log(meetingfind)
        console.log(calendarStore.meetingCanUse)
        calendarStore.removeMeetingCanUse(meetingfind.id)
        calendarStore.scheduleMeeting(event,meetingDay.value)
      }
    }
    else{
      console.log("发送邮件报错")
    }



    resetForm();
  };
  
  // 表单验证
  const validateForm = () => {
    // if (!selectedRecipient.value?.name) {
    //   alert('请选择至少一个收件人');
    //   return false;
    // }
    if (!selectedSubject) {
      alert('Please select the subject of the email');
      return false;
    }
    return true;
  };
  
  // 重置表单
  const resetForm = () => {
    isMeeting.value = false
    selectedRecipient.value = undefined 
    selectedSubject.value = ''
    emailContent.value = '';
    emit('update:open', useUIStore().toggleSending(false));
  };
  
  // 取消操作
  const handleCancel = () => {
    resetForm();
  };
  </script>
  
  <style scoped>
  /* 样式优化 */
  .ant-modal-body {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .ant-select, .ant-input, .ant-textarea {
    margin-bottom: 16px;
  }

  .meeting-day{
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
  }
  </style>