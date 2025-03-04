<script lang="ts" setup>
//用于作为邮件页面的整体框架
import { ref, defineProps, defineEmits } from 'vue';
import { useGlobalStore } from '../../../stores/global';
import type { Email } from '../../../stores/type';
const props = defineProps({
  initialEmails: { type: Array, default: () => [] },
  title: { type: String, default: 'Mail box' },
  subTitle: { type: String, default: 'check and manage' },
  newButtonText: { type: String, default: 'new mail' },
  modalVisible: { type: Boolean, default: false },
});

const store = useGlobalStore();


const emit = defineEmits(['create-new', 'update:modalVisible',"update:modalContent"])

const emails = ref([...props.initialEmails]);

const columns = [
  { title: 'sender', dataIndex: 'sender', key: 'sender' },
  { title: 'subject', dataIndex: 'subject', key: 'subject' },
  { title: 'time ', dataIndex: 'time', key: 'time' },
  {
    title: 'Action',
    key: 'action',
  },
];

const onCreateNew = () => {
  emit('create-new');
};

const onActionClick = (record: Email) => {
  // alert(`click on：${record.subject}\nsender：${record.sender}\ntimeline：${record.time}`);
  emit('update:modalVisible')
  emit('update:modalContent',record.detail)
  store.setCurrentEmail(record)

};
</script>



<template>
  <div class="inbox-container">
    <a-page-header :title="title" :sub-title="subTitle">
      <template #extra>
        <a-button type="primary" @click="onCreateNew">{{ newButtonText }}</a-button>
      </template>
    </a-page-header>

    <a-table 
      :columns="columns" 
      :data-source="emails"
      :scroll="{ x: 'max-content', y: 'calc(100vh - 240px)' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'subject'">
          <a class="subject-link">{{ record.subject }}</a>
        </template>

        <template v-else-if="column.key === 'action'">
          <a class="action-link" @click="onActionClick(record)">View Details</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="less">
@import "./style.less"; // 外部引入样式

// 保留必要的作用域样式（如果有）
:deep(.ant-table-thead) th {
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>