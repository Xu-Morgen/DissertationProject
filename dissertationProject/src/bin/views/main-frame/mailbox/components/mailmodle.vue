<script lang="ts" setup>
//用于在点击邮件页面detail当中时弹出的页面
import { computed } from 'vue';
import { useGlobalStore } from '../../../../stores/global';
import { useEmails } from '../../../../stores/emails';
import { useUserTasks} from '../../../../stores/userTask';
import type { Email, Task, UserTask } from '../../../../stores/type';

const store = useGlobalStore();
const emails = useEmails();
const userTask = useUserTasks();

// 接收外部传入的 `open` 状态和 `Content`
const props = defineProps<{
  open: boolean;
  content: Email;
}>();

//去重检查
const checkDuplicate = () => {
  const { type, typeContent } = props.content
  
  // 安全检查层级
  if (!typeContent) return false
  
  switch(type) {
    case 'Task':
      return store.tasks.some(t => 
        t.id === (typeContent as Task).id
      )
    case 'UserTask':
      return userTask.tasks.some(t => 
        t.id === (typeContent as UserTask).id
      )
    default:
      return false
  }
}


const formatEmailContent = (text: string = '') => {
  return text
    .replace(/ /g, '&nbsp;')  // 保留空格
    .replace(/\n/g, '<br>')   // 转换换行
}

// 触发事件通知父组件状态变化
const emit = defineEmits(["update:open", "ok"]);

const handleOk = (e: MouseEvent) => {
  emit("ok", e); // 触发 `ok` 事件，通知父组件
  emit("update:open", false); // 关闭模态框


  if(emails.currentEmail.type == "Task"){
    if(emails.currentEmail.typeContent){
      store.addTask(emails.currentEmail.typeContent as Task)
    }
  }

  else if(emails.currentEmail.type == "UserTask"){
    if(emails.currentEmail.typeContent){
      userTask.addTask(emails.currentEmail.typeContent as UserTask)
    }
  }

  if(emails.currentEmail.type != "Sent"){
    if(emails.currentEmail.EventParam){
      emails.currentEmail.Event.action(emails.currentEmail.EventParam)
    }
    else{
      emails.currentEmail.Event.action()
    }
  }


};

const handleCancel = () => {
  emit("update:open", false);
};
</script>

<template>
  <a-modal
    :open="open"
    :title="content.subject"
    @ok="handleCancel"
    @cancel="handleCancel"
    destroyOnClose
  >
  <div 
      class="email-content"
      v-html="formatEmailContent(content.detail)"
    >
  </div>
    <!-- 如果Content是HTML字符串，可以使用 v-html -->
    <!-- <p v-html="Content" class="email-content"></p> -->

    <template #footer v-if="(content.type == `Task`|| content.type == `UserTask`) && (!checkDuplicate())" >
      <a-button key="back" @click="handleCancel">Pending</a-button>
      <a-button key="reject" type="primary" @click="handleOk" danger>Reject</a-button>
      <a-button key="accept" type="primary" @click="handleOk">Accept</a-button>
    </template>

    <template #footer v-else>
      <a-button key="ok" type="primary" @click="handleOk">OK</a-button>
    </template>
  </a-modal>
</template>


<style scoped>
.email-content {
  line-height: 1.6;
  font-family: -apple-system, sans-serif;
}

.email-content::v-deep(br) {
  margin-bottom: 0.8em;
  content: '';
  display: block;
}
</style>