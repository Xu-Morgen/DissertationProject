<template>
    <a-modal
      :open="open"
      title="Sent Email"
      @ok="handleSend"
      @cancel="handleCancel"
      destroyOnClose
      :styles="{ body: { maxHeight: '70vh' } }"
    >
      <a-select
        v-model:value="selectedRecipient"
        placeholder="Select recipient"
        style="width: 100%; margin-bottom: 10px"
        :options="recipientOptions"
        show-search
        option-filter-prop="label"
      />


        <a-select
        v-model:value="selectedSubject"
        placeholder="Select Subject"
        style="width: 100%; margin-bottom: 10px"
        :options="subjectOptions"
        mode='single'
        show-search
        option-filter-prop="label"
      />
  
      

      <a-textarea
        v-model:value="emailContent"
        placeholder="Email text"
        :rows="6"
        style="width: 100%; margin-bottom: 10px"
        readonly
      />

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
    selectedSubject.value = '';
    emailContent.value = '';
    isMeeting.value = false;
    meetingDay.value = 0;
    selectedMeeting.value = undefined;
  });
    
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



  const recipientOptions = computed(() => 
    emailStore.contacts
      .map(c => ({
        value: c.id,
        label: c.name
      }))
  );
  
  const subjectOptions = computed(() => {
    console.log("sentFormat:", emailStore.sentFormat);
    console.log("selectedRecipient id:", selectedRecipient.value  );

    if (!selectedRecipient.value) return [];
    const recipientId = selectedRecipient.value; 
    subject.value = emailStore.getSubjectsByRecipient(recipientId);
    console.log(subject.value)
    return subject.value.map((c) => ({
      value: c.subject, 
      label: c.subject
    }));
  });



  
  watch(selectedSubject, (newSubject) => {
    const content = selectedSubject ? subject.value.find(t=>t.subject === selectedSubject.value)?.content : "";
    if(content){
      emailContent.value = content
    }

  });
  
  const handleSend = () => {
    if (!validateForm()) return;
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
    emailStore.sentEmail(newEmail);
  
    const format = subject.value.find(t=>t.subject === selectedSubject.value)
      if(format?.nextEventId){
        eventStore.triggerEvent(format.nextEventId, GAME_EVENTS);
      }
    }
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
      console.log("send email error")
    }



    resetForm();
  };
  
  const validateForm = () => {

    if (!selectedSubject) {
      alert('Please select the subject of the email');
      return false;
    }
    return true;
  };
  
  const resetForm = () => {
    isMeeting.value = false
    selectedRecipient.value = undefined 
    selectedSubject.value = ''
    emailContent.value = '';
    emit('update:open', useUIStore().toggleSending(false));
  };
  
  const handleCancel = () => {
    resetForm();
  };
  </script>
  
  <style scoped>
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