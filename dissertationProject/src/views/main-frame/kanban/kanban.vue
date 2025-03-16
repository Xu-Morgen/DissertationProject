<template>
  <div class="kanban-container">
    <!-- 优先级看板区域（垂直排列） -->
、
    <a-divider orientation="left" class="spring-divider">
      <a-tag color="#87d068" class="divider-tag">
        <rocket-outlined /> Priority
      </a-tag>
    </a-divider>
    <div class="priority-kanbans">
      <div class="kanban-box must-kanban">
        <a-transfer
          v-model:data-source="datalist1"
          v-model:target-keys="list2"
          :render="renderFunc"
          @change="(t, d, m) => handleChange(t, d, m, 'list2', 1)"
          :title="getPriorityTitle(1)"
        />
      </div>

      <div class="kanban-box should-kanban">
        <a-transfer
          v-model:data-source="datalist2"
          v-model:target-keys="list3"
          :render="renderFunc"
          @change="(t, d, m) => handleChange(t, d, m, 'list3', 2)"
          :title="getPriorityTitle(2)"
        />
      </div>

      <div class="kanban-box can-kanban">
        <a-transfer
          v-model:data-source="datalist3"
          v-model:target-keys="list4"
          :render="renderFunc"
          @change="(t, d, m) => handleChange(t, d, m, 'list4', 3)"
          :title="getPriorityTitle(3)"
        />
      </div>
    </div>

    <!-- Spring看板 -->
    <a-divider orientation="left" class="spring-divider">
      <a-tag color="#87d068" class="divider-tag">
        <rocket-outlined /> Spring
      </a-tag>
    </a-divider>

    <div class="spring-kanban-box">
      <a-transfer
        v-model:data-source="springList"
        v-model:target-keys="springSelect"
        :render="renderFunc"
        title="SPRING"
      />
    </div>

    <!-- 任务列表 -->
    <a-divider orientation="left" class="task-divider">
      <a-tag color="#2db7f5">task list</a-tag>
    </a-divider>
    
    <div class="task-list-container">
      <a-button 
        @click="store.clearTasks()" 
        type="primary" 
        danger
        class="clear-btn"
      >
        <delete-outlined /> clear task(test only)
      </a-button>
      
      <div v-if="tasks.length > 0" class="task-cards">
        <a-card 
          v-for="(task, index) in tasks" 
          :key="index"
          class="task-card"
          :class="getPriorityClass(task.arrange)"
        >
          <template #title>
            <div class="card-title">
              <a-tag :color="getPriorityColor(task.arrange)">
                task{{ index + 1 }}
              </a-tag>
              <span class="subject-text">{{ task.subject }}</span>
            </div>
          </template>
          <div class="card-content">
            <p class="detail-text">{{ task.detail }}</p>
            <a-divider dashed />
            <div class="meta-info">
              <span>priotity: {{ getPriorityText(task.arrange) }}</span>
              <a-tag v-if="task.relate" color="purple">{{ task.relate }}</a-tag>
            </div>
          </div>
        </a-card>
      </div>
      <a-empty v-else description="no task" />
    </div>
  </div>
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

const getPriorityText = (priority: number) => {
  return ['unarranged', 'must', 'should', 'can'][priority] || 'unkonwen';
};

const getPriorityTitle = (priority: number) => {
  switch(priority) {
    case 1: return 'Must (tier 1)';
    case 2: return 'Should (tier 2)';
    case 3: return 'Can (tier 3)';
    default: return 'unarranged';
  }
};

const getPriorityColor = (priority: number) => {
  switch(priority) {
    case 1: return '#ff4d4f';
    case 2: return '#faad14';
    case 3: return '#52c41a';
    default: return '#d9d9d9';
  }
};

const getPriorityClass = (priority: number) => {
  return `priority-${priority}`;
};
</script>


<style scoped lang="less">
.kanban-container {
  padding: 24px;
  background: #f5f7fa;
  max-width: 1200px;
  margin: 0 auto;
}

// 优先级看板样式（垂直排列）
.priority-kanbans {
  display: grid;
  gap: 24px;

  .kanban-box {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 16px;
    
    // 统一优先级边框样式
    &[class*="-kanban"] {
      border-left: 4px solid;
    }
    
    &.must-kanban { border-color: #ff4d4f; }
    &.should-kanban { border-color: #faad14; }
    &.can-kanban { border-color: #52c41a; }
  }
}

// 穿梭框通用样式
:deep(.ant-transfer) {
  display: flex !important;
  gap: 24px;

  .ant-transfer-list {
    width: 100% !important;
    height: 400px;
    min-width: 400px;

    &-header {
      min-height: 60px;
      padding: 12px;
      background: #fafafa;
      
      &-title {
        font-size: 16px;
        white-space: normal;
        line-height: 1.4;
        word-break: break-word;
      }
    }

    &-body {
      padding: 8px;
      
      .ant-transfer-list-content-item {
        padding: 10px;
        margin: 4px 0;
        border-radius: 4px;
        
        > span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          background: #f0f5ff;
          transform: translateX(2px);
        }
      }
    }
  }
}

// Spring看板特殊样式
.spring-divider {
  margin: 40px 0 24px;
  
  .divider-tag {
    font-size: 16px;
    padding: 8px 16px;
  }
}

.spring-kanban-box {
  background: #f6ffed;
  border: 2px dashed #73d13d;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
}

// 任务卡片样式优化
.task-card {
  transition: all 0.2s;
  
  .subject-text {
    font-size: 16px;
    font-weight: 500;
    margin-left: 8px;
  }
  
  .detail-text {
    color: rgba(0, 0, 0, 0.85);
    line-height: 1.6;
  }
  
  .meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
}

// 响应式调整
@media (max-width: 768px) {
  :deep(.ant-transfer) {
    flex-direction: column;
    
    .ant-transfer-list {
      min-width: unset;
      height: 300px;
    }
  }
  
  .kanban-container {
    padding: 16px;
  }
}
</style>