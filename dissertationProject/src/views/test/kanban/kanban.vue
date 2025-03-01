<template>
  <a-row :gutter="16">
    <!-- Must List -->
    <a-col :span="8">
      <a-transfer
        v-model:data-source="datalist1"
        v-model:target-keys="list2"
        :render="renderFunc"
        @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list2', 1)"
        title="Must"
      />
    </a-col>

    <!-- Should List -->
    <a-col :span="8">
      <a-transfer
        v-model:data-source="datalist2"
        v-model:target-keys="list3"
        :render="renderFunc"
        @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list3', 2)"
        title="Should"
      />
    </a-col>

    <!-- Can List -->
    <a-col :span="8">
      <a-transfer
        v-model:data-source="datalist3"
        v-model:target-keys="list4"
        :render="renderFunc"
        @change="(targetKeys, direction, moveKeys) => handleChange(targetKeys, direction, moveKeys, 'list4', 3)"
        title="Can"
      />
    </a-col>
  </a-row>

  <a-row>
    <a-col :span="8">
      <a-transfer
        v-model:data-source="springList"
        v-model:target-keys="springSelect"
        :render="renderFunc"
        title="Spring"
      />
    </a-col>
  </a-row>

  <a-row>
    <div v-if="tasks.length > 0">
      <a-button @click="()=>store.clearTasks()">clear tasks</a-button>
      <p v-for="(task, index) in tasks" :key="index">
        <strong>Task {{ index + 1 }}:</strong> {{ task.detail }} <br>
        <!-- <strong>isAccept:</strong> {{ task.isAccept }} <br>
        <strong>hiddenImport:</strong> {{ task.hiddenImportant }} <br> -->
        <strong>subject:</strong> {{ task.subject }} <br>
        <strong>priority:</strong> {{ task.arrange }} <br>
        <span v-if="task.relate"><strong>relates:</strong> {{ task.relate }}</span>
      </p>
    </div>
    <p v-else>no task</p>
  </a-row>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import { useGlobalStore } from '../../../stores/global';

const store = useGlobalStore();
const tasks = computed(() => store.tasks); // 引用任务列表

const taskList = store.tasks;
const unarrangedTask = ref(taskList.filter(task => task.isFinished === false));

//周期任务列表
const springList = ref(taskList.filter(i=>i.isFinished==false).map(task => ({ key: task.id, title: task.subject })));
const springSelect = ref<string[]>([]);


// 初始化任务列表数据
const list1 = ref(unarrangedTask.value.map(task => ({ key: task.id, title: task.subject })));
const datalist1 = ref([...list1.value]);
const datalist2 = ref([...list1.value]);
const datalist3 = ref([...list1.value]);
const list2 = ref<string[]>([]);  // Must list
const list3 = ref<string[]>([]);  // Should x
const list4 = ref<string[]>([]);  // Can list
onMounted(() => {
  // 将 mustTask 存入 list2（优先级 1）
  store.mustTask.forEach(taskId => {
    const task = store.tasks.find(t => t.id === taskId && t.arrange === 1);
    if (task) {
      console.log(task.id);
      list2.value.push(task.id);
      // 从 datalist2 和 datalist3 中移除该任务
      datalist2.value = datalist2.value.filter(item => task.id != item.key);
      datalist3.value = datalist3.value.filter(item => task.id != item.key);
    }
  });

  // 将 shouldTask 存入 list3（优先级 2）
  store.shouldTask.forEach(taskId => {
    const task = store.tasks.find(t => t.id === taskId && t.arrange === 2);
    if (task) {
      list3.value.push(task.id);
      // 注意：这里应该过滤 datalist1 本身，而不是 datalist2
      datalist1.value = datalist1.value.filter(item => task.id != item.key);
      datalist3.value = datalist3.value.filter(item => task.id != item.key);
    }
  });

  // 将 canTask 存入 list4（优先级 3）
  store.canTask.forEach(taskId => {
    const task = store.tasks.find(t => t.id === taskId && t.arrange === 3);
    if (task) {
      list4.value.push(task.id);
      // 注意：这里也应该过滤 datalist1，而不是 datalist3
      datalist1.value = datalist1.value.filter(item => task.id != item.key);
      datalist2.value = datalist2.value.filter(item => task.id != item.key);
    }
  });

  console.log(store.canTask);
  console.log(store.shouldTask);
  console.log(store.mustTask);
});



const renderFunc = (item: { title: string }) => item.title;

// handleChange 方法用于更新任务优先级
const handleChange = (targetKeys, direction, moveKeys, list) => {
  console.log(targetKeys, direction, moveKeys, list);


  // 处理任务移动，并更新全局状态中的优先级
  moveKeys.forEach((key) => {
    let priority = 0
    if(direction === "right"){
      if(list === "list2"){
        priority = 1
      }
      else if(list === "list3"){
        priority = 2
      }
      else{
        priority = 3
      }

    }
    const task = store.tasks.find(t => t.id === key);
    if (task) {
      store.updateTaskPriority(key, priority);
    }
  });

  // 更新目标数据列表
  if (direction === 'right') {
    if (list === 'list2') {
      datalist2.value = datalist2.value.filter(item => !moveKeys.includes(item.key));
      datalist3.value = datalist3.value.filter(item => !moveKeys.includes(item.key));
    }
    if (list === 'list3') {
      datalist1.value = datalist1.value.filter(item => !moveKeys.includes(item.key));
      datalist3.value = datalist3.value.filter(item => !moveKeys.includes(item.key));
    }
    if (list === 'list4') {
      datalist1.value = datalist1.value.filter(item => !moveKeys.includes(item.key));
      datalist2.value = datalist2.value.filter(item => !moveKeys.includes(item.key));
    }
  }

  if (direction === 'left') {
    moveKeys.forEach((key) => {
      const originalItem = unarrangedTask.value.find(task => task.id === key);
      if (originalItem) {
        const item = { key: originalItem.id, title: originalItem.subject };

        if (!datalist1.value.some(i => i.key === item.key)) datalist1.value.push(item);
        if (!datalist2.value.some(i => i.key === item.key)) datalist2.value.push(item);
        if (!datalist3.value.some(i => i.key === item.key)) datalist3.value.push(item);
      }
    });
  }
};

</script>

<style scoped>
/* 样式自定义 */
</style>
