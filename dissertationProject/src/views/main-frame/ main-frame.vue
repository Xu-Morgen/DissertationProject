<script lang="ts" setup>
import { onBeforeUpdate, onUpdated, ref,h, watch, watchEffect, computed } from 'vue';
import { useGlobalStore } from '../../stores/global';
import Inbox from "./mailbox/mailbox.vue"
import Kanban from "./kanban/kanban.vue"
import MailModal from "./mailbox/components/mailmodle.vue"
import MailSentModal from "./mailbox/components/mailsent.vue"
import Configmodal from './configmodal.vue';
import Clander from './clander/clander.vue';
import {emailList} from "./mockData"
import Logic from "../../service/logicService"
import logicService from '../../service/logicService';
import { SearchOutlined,ToolOutlined } from '@ant-design/icons-vue';

const store = useGlobalStore();
const progress = store.progress

const handleCreateNew = () => {
  mailSentModalOpen.value = true
};

const currentContent = ref('mailbox');
const MailModalContent = ref({} as String);

const changeContent = (content: string) => {
  currentContent.value = content;
};
//用于处理发送邮件 TODO
const handleSendEmail = (emailData: any) => {
  console.log("Email Sent:", emailData);
};
const mailboxModalOpen = ref(false);
const mailSentModalOpen = ref(false);

const openMailModal = () =>{
    mailboxModalOpen.value = true
};

// 配置面板 Modal 状态
const configModalVisible = ref(false);

// 打开配置 Modal
const openConfigModal = () => {
  configModalVisible.value = true;
};

// 获取任务列表
const tasks = computed(() => store.tasks);

// 任务栏展开/收起状态
const taskSidebarVisible = ref(true);

// 处理任务栏展开/收起
const toggleTaskSidebar = () => {
  taskSidebarVisible.value = !taskSidebarVisible.value;
};


watchEffect(()=>{
    logicService.checkFirstTimePlay()
})



</script>


<template>
      <div class="main-layout">
        <a-layout>
        <a-layout-header class="my-header">
            <Configmodal
            v-model:open="configModalVisible"/>
            <a-button type="primary" shape="circle" @click="openConfigModal" :icon="h(ToolOutlined)" />
            {{ progress }}
        </a-layout-header>
        <!--邮件modal-->
        <a-layout>
            <!--用于发送邮件-->
            <MailSentModal
                v-model:open="mailSentModalOpen"
                :emailList="emailList.map(email=>({subject: email.subject, type:email.type.toString()}))"
                @sendEmail="handleSendEmail"
            />
            <!--用于显示邮件详细内容-->
            <MailModal v-model:open="mailboxModalOpen" v-model:content="MailModalContent"/>
            <a-layout-content class="my-content">
                <!--邮件主题页面-->
                <div v-if="currentContent === 'mailbox'">
                    <Inbox
                        :initialEmails="emailList"
                        @create-new="handleCreateNew"
                        @update:modal-visible="openMailModal"
                        @update:modal-content="(newContent) => MailModalContent = newContent"
                        />
                </div>
                <!--Kanban-->
                <div v-if="currentContent === 'Kanban'">
                    <Kanban/>
                </div>

                <div v-if="currentContent === 'clander'">
                    <Clander/>
                </div>
            </a-layout-content>
            <a-layout-sider class="my-sider">
                    <div class="control-bar">
                        <a-button type="primary" href="/">
                            Close
                        </a-button>
                        <a-button type="primary" @click="changeContent('clander')">
                            Clander
                        </a-button>
                        <!-- 切换任务列表显示 -->
                        <a-button type="primary" @click="toggleTaskSidebar">
                            Toggle Tasks
                        </a-button>
                        
                        <!-- 任务列表 -->
                        <div v-if="tasks.length > 0" class="task-list">
                            <h3>Current Tasks</h3>
                            <ul>
                            <li v-for="task in tasks" :key="task.id" :style="{ textDecoration: task.isFinished ? 'line-through' : 'none' }">
                                <span>{{ task.detail }}</span>
                                <span v-if="task.isFinished" style="color: green;">(Completed)</span>
                                <span v-else style="color: red;">(Pending)</span>
                            </li>
                            </ul>
                        </div>
                        <div v-else>
                            <span>No tasks available</span>
                        </div>
                    </div>
                    
                </a-layout-sider>
            </a-layout>
            <a-layout-footer class="my-footer">
                <div class="control-bar">
                    <a-badge count="5">
                        <a-button type="primary" @click="changeContent('mailbox')">
                            mail box
                        </a-button>
                    </a-badge>

                    <a-button type="primary" @click="changeContent('Kanban')">
                        KanBan
                    </a-button>
                </div>

            </a-layout-footer>
    </a-layout>
</div>

</template>

<style scoped lang="less">
@import "./index.less";
// 控制任务栏样式
.my-sider {
  width: 250px;
  background-color: #f0f2f5;
  padding: 10px;
  border-right: 1px solid #e8e8e8;
}

.task-list h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.task-list ul {
  list-style: none;
  padding: 0;
}

.task-list li {
  margin-bottom: 5px;
  font-size: 14px;
}

.task-list li span {
  margin-left: 5px;
}

.task-list li span:after {
  margin-left: 5px;
}
// 需要深度选择器覆盖的样式
:deep(.ant-btn-primary) {
  transition: all @transition-duration @transition-easing;
  
  &:hover {
    transform: scale(1.05);
  }
}
</style>