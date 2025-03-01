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

<style scoped>
.filter-section {
  margin-bottom: 16px;
}
</style>

<template>
  <div>
    <a-page-header :title="title" :sub-title="subTitle">
      <template #extra>
        <a-button type="primary" @click="onCreateNew">{{ newButtonText }}</a-button>
      </template>
    </a-page-header>

    <a-table :columns="columns" :data-source="emails">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'subject'">
        <a>
          {{ record.subject }} 
        </a>

      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <a @click="onActionClick(record)">check detail</a>
        </span>
      </template>
      
    </template>
  </a-table>
  </div>
</template>

