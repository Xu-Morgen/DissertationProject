<template>
    <a-row :gutter="16">
      <a-col :span="8">
        <a-transfer
          v-model:data-source="datalist1"
          v-model:target-keys="list2"
          :render="renderFunc"
          @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list2')"
          title="List 2"
        />
      </a-col>
      <a-col :span="8">
        <a-transfer
          v-model:data-source="datalist2"
          v-model:target-keys="list3"
          :render="renderFunc"
          @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list3')"
          title="List 3"
        />
      </a-col>
      <a-col :span="8">
        <a-transfer
          v-model:data-source="datalist3"
          v-model:target-keys="list4"
          :render="renderFunc"
          @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list4')"
          title="List 4"
        />
      </a-col>
    </a-row>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  const list1 = ref([
    { key: '1', title: 'item 1' },
    { key: '2', title: 'item 2' },
    { key: '3', title: 'item 3' },
    { key: '4', title: 'item 4' },
    { key: '5', title: 'item 5' },
    { key: '6', title: 'item 6' },
    { key: '7', title: 'item 7' },
    { key: '8', title: 'item 8' },
    { key: '9', title: 'item 9' },
    { key: '10', title: 'item 10' }
  ]);
  
  // 初始目标列表
  const list2 = ref<string[]>([]);
  const list3 = ref<string[]>([]);
  const list4 = ref<string[]>([]);
  
  // 目标列表数据
  const datalist1 = ref([...list1.value]);
  const datalist2 = ref([...list1.value]);
  const datalist3 = ref([...list1.value]);
  
  // 渲染函数
  const renderFunc = (item: { title: string }) => item.title;
  
  // 处理改变目标列表的函数
  const handleChange = (targetKeys, direction, moveKeys, list) => {
    console.log(targetKeys);
    console.log(direction);
    console.log(moveKeys);
    console.log(list);
  
    if (direction === "right") {
      if (list === "list2") {
        datalist2.value = datalist2.value.filter(item => !moveKeys.includes(item.key));
        datalist3.value = datalist3.value.filter(item => !moveKeys.includes(item.key));
      }
      if (list === "list3") {
        datalist1.value = datalist1.value.filter(item => !moveKeys.includes(item.key));
        datalist3.value = datalist3.value.filter(item => !moveKeys.includes(item.key));
      }
      if (list === "list4") {
        datalist1.value = datalist1.value.filter(item => !moveKeys.includes(item.key));
        datalist2.value = datalist2.value.filter(item => !moveKeys.includes(item.key));
      }
    }
  
    if (direction === "left") {
      // 向左移动时，重新将项目添加回所有datalist
      moveKeys.forEach(key => {
        const item = { key, title: `item ${key}` };
  
        // 将项目添加回所有datalist
        if (!datalist1.value.some(i => i.key === key)) datalist1.value.push(item);
        if (!datalist2.value.some(i => i.key === key)) datalist2.value.push(item);
        if (!datalist3.value.some(i => i.key === key)) datalist3.value.push(item);
      });
    }
  };
  </script>
  
  <style scoped>
  /* 样式自定义 */
  </style>
  