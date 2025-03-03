<script lang="ts" setup>
import { ref } from 'vue';
import { useGlobalStore } from '../../stores/global';
import Inbox from "./mailbox/mailbox.vue"
import Kanban from "./kanban/kanban.vue"
import MailModal from "./mailbox/components/mailmodle.vue"
import MailSentModal from "./mailbox/components/mailsent.vue"
import Clander from './clander/clander.vue';
import {emailList} from "./mockData"
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
const handleSendEmail = (emailData: any) => {
  console.log("Email Sent:", emailData);
};
const mailboxModalOpen = ref(false);
const mailSentModalOpen = ref(false);

const openMailModal = () =>{
    mailboxModalOpen.value = true
    console.log(mailboxModalOpen.value)
};

interface mailModalContent{
    content:String;
    subject:String;
    detail:String;
}

</script>


<template>
    <a-layout>
        <a-layout-header class="my-header">{{ progress }}</a-layout-header>
        <!--邮件modal-->
        <a-layout>
            <MailSentModal
                v-model:open="mailSentModalOpen"
                :emailList="emailList.map(email=>({subject: email.subject, type:email.type.toString()}))"
                @sendEmail="handleSendEmail"
            />
            <MailModal v-model:open="mailboxModalOpen" v-model:content="MailModalContent"/>
            <a-layout-content class="my-content">
                <!--邮件页面-->
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
</template>

<style scoped lang="less">
.my-header {
    background-color: yellow;
    height: 15vh;
    width: 60vw;
}

.my-content {
    height: 55vh;
    width: 50vw;
}

.my-sider {
    height: 55vh;
    width: 10vw;
    .control-bar{
        margin-top: 20px;
        gap: 20px;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: center;
    }

}
.my-footer {
    height: 15vh;
    width: 60vw;
    .control-bar{
        margin-top: 20px;
        gap: 20px;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
    }
}
</style>
