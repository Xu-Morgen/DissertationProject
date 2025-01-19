<script lang="ts" setup>
import { useGlobalStore } from '../../stores/global';
import Inbox from "./mailbox/mailbox.vue"
const store = useGlobalStore();

const progress = store.progress

const emailList = [
  { id: 1, sender: 'Alice', subject: '欢迎使用收件箱', time: '2025-01-19 12:30' },
  { id: 2, sender: 'Bob', subject: '会议邀请', time: '2025-01-18 15:00' },
  { id: 3, sender: 'Charlie', subject: '月度报告', time: '2025-01-17 10:00' },
];

const handleCreateNew = () => {
  console.log('点击新邮件按钮');
};
</script>


<template>
    <a-layout>
        <a-layout-header class="my-header">{{ progress }}</a-layout-header>
        <a-layout>
            <a-layout-content class="my-content">
                <Inbox
                    :initialEmails="emailList"
                    @create-new="handleCreateNew"
                    />
            </a-layout-content>
            <a-layout-sider class="my-sider">
                    <div class="control-bar">
                        <a-button type="primary" href="/">
                            Close
                        </a-button>
                        <a-button type="primary">
                            Clander
                        </a-button>
                    </div>
                </a-layout-sider>
            </a-layout>
            <a-layout-footer class="my-footer">
                <div class="control-bar">
                    <a-badge count="5">
                        <a-button type="primary">
                            mail box
                        </a-button>
                    </a-badge>

                    <a-button type="primary">
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
