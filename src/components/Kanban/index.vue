<template>
  <div class="kanban-container">
    <!-- 优先级看板区域 -->
    <div class="kanban-section">
      <a-divider orientation="left" class="custom-divider">
        <div class="divider-header">
          <!-- 左侧图标和标题 -->
          <div class="header-left">
            <a-tag color="#1890ff" class="divider-tag">
              <rocket-outlined /> Priority board
            </a-tag>
          </div>

          <!-- 右侧选项卡和按钮 -->
          <div class="header-right">
            <div class="priority-tabs">
              <div 
                v-for="tab in priorityTabs"
                :key="tab.value"
                class="tab-item"
                :class="{ active: activeTab === tab.value }"
                @click="setActiveTab(tab.value)"
              >
                <span class="tab-label">{{ tab.label }}</span>
                <span class="tab-count">{{ getTabCount(tab.value) }}</span>
                <div class="indicator"></div>
              </div>
            </div>

          </div>
        </div>
      </a-divider>

      <!-- 看板内容容器 -->
      <div class="kanban-content">
        <!-- 紧急优先级看板 -->
        <div 
          class="priority-kanban urgent-kanban"
          v-show="activeTab === 'urgent'"
        >
          <a-transfer
            v-model:data-source="datalist1"
            v-model:target-keys="list2"
            :render="renderFunc"
            @change="(t: string[], d: string, m: string[]) => handleChange('urgent',t, d, m,1)"
            class="custom-transfer"
          />
        </div>

        <!-- 高优先级看板 -->
        <div 
          class="priority-kanban high-kanban"
          v-show="activeTab === 'high'"
        >
          <a-transfer
            v-model:data-source="datalist2"
            v-model:target-keys="list3"
            :render="renderFunc"
            @change="(t: string[], d: string, m: string[]) => handleChange('high',t, d, m,2)"
            class="custom-transfer"
          />
        </div>

        <!-- 低优先级看板 -->
        <div 
          class="priority-kanban low-kanban"
          v-show="activeTab === 'low'"
        >
          <a-transfer
            v-model:data-source="datalist3"
            v-model:target-keys="list4"
            :render="renderFunc"
            @change="(t: string[], d: string, m: string[]) => handleChange('low',t, d, m,3)"
            class="custom-transfer"
          />
        </div>
      </div>
    </div>

    <!-- 任务列表区域 -->
    <div class="task-section">
      <a-divider orientation="left" class="custom-divider">
        <a-tag color="#52c41a" class="divider-tag">task list</a-tag>
      </a-divider>

      <!-- <div class="task-controls">
        <a-button 
          @click="taskStore.clearTasks()" 
          type="primary" 
          danger
          class="control-button"
        > 
          <delete-outlined /> Clear test tasks
        </a-button>
      </div> -->

      <div v-if="tasks.length > 0" class="task-grid">
        <a-card 
          v-for="(task, index) in tasks" 
          :key="task.id"
          class="task-card"
          :class="getPriorityClass(task)"
        >
          <template #title>     
            <div class="card-header">
              <a-tag :color="getPriorityColor(task.priority)" class="task-tag">
                TASK-{{ index + 1 }}
              </a-tag>
              <span class="task-title">{{ task.title }}</span>
              <a-tag v-if="task.status === 'done'" color="green" class="done-tag">done</a-tag>
            </div>
          </template>
          
          <div class="card-content">
            <p class="task-description">{{ task.description }}</p>
            <a-divider class="content-divider" />
            
            <div class="task-meta">
              <span class="meta-item">
                <clock-circle-outlined />
                Priority:{{ task.priority }}
              </span>
            </div>
          </div>
        </a-card>
      </div>
      <a-empty v-else description="There are no tasks for the time being." class="empty-state" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '@/stores';
import type { Task, TaskPriority } from '@/types';
import { DeleteOutlined, ClockCircleOutlined, RocketOutlined, PlusOutlined } from '@ant-design/icons-vue';

const taskStore = useTaskStore();

// 响应式状态
const activeTab = ref<TaskPriority>('urgent');
const priorityTabs = ref<{value:TaskPriority,label:string,color:string}[]>([
  { value: 'urgent', label: 'urgent tasks', color: '#ff4d4f' },
  { value: 'high', label: 'important tasks', color: '#faad14' },
  { value: 'low', label: 'General tasks', color: '#52c41a' }
]);

// 任务数据
const tasks = computed(() => taskStore.backlog);
const unarrangedTask = computed(() => 
  tasks.value.filter(task => task.status !== 'done')
);

// 初始化数据源
const initializeDataSources = () => {
  const baseData = unarrangedTask.value.map(task => ({
    key: task.id,
    title: `${task.id} - ${task.title}`
  }));

  return {
    list1: ref([...baseData]),
    list2: ref<string[]>([]),
    list3: ref<string[]>([]),
    list4: ref<string[]>([])
  };
};

const { list1, list2, list3, list4 } = initializeDataSources();
const datalist1 = ref([...list1.value]);
const datalist2 = ref([...list1.value]);
const datalist3 = ref([...list1.value]);

// 组件挂载时初始化看板数据
onMounted(() => {
  // 初始化紧急任务
  taskStore.backlog
    .filter(t => t.priority === 'urgent' && t.status !== 'done')
    .forEach(task => {
      list2.value.push(task.id);
      datalist2.value = datalist2.value.filter(item => item.key !== task.id);
      datalist3.value = datalist3.value.filter(item => item.key !== task.id);
    });

  // 初始化重要任务
  taskStore.backlog
    .filter(t => t.priority === 'high' && t.status !== 'done')
    .forEach(task => {
      list3.value.push(task.id);
      datalist1.value = datalist1.value.filter(item => item.key !== task.id);
      datalist3.value = datalist3.value.filter(item => item.key !== task.id);
    });

  // 初始化一般任务
  taskStore.backlog
    .filter(t => t.priority === 'low' && t.status !== 'done')
    .forEach(task => {
      list4.value.push(task.id);
      datalist1.value = datalist1.value.filter(item => item.key !== task.id);
      datalist2.value = datalist2.value.filter(item => item.key !== task.id);
    });
});

// 获取选项卡任务数量
const getTabCount = (tabValue: TaskPriority): number => {
  const countMap: Record<TaskPriority, number> = {
    urgent: list2.value.length,
    high: list3.value.length,
    low: list4.value.length,
    medium:0,
    none: 0 // 补充类型定义
  };
  return countMap[tabValue];
};

// 切换选项卡
const setActiveTab = (tab: TaskPriority) => {
  activeTab.value = tab;
};

// handle transfer
const handleChange = (priority: TaskPriority, targetKeys:string[], direction:string, moveKeys:string[],listNumber:number) => {

  // current transfer list
  const listConfig = [
    [datalist2, datalist3],
    [datalist1, datalist3],
    [datalist1, datalist2]
  ];

  if (direction === 'right') {
    moveKeys.forEach((key: string) => {
      const task = taskStore.backlog.find(t => t.id === key);
      if (task) {
        taskStore.updateTaskPriority(key, priority);
      }
    });
    listConfig[listNumber-1].forEach(list => {
      list.value = list.value.filter(item => !moveKeys.includes(item.key));
    });
  } else if (direction === 'left') {
    moveKeys.forEach((key: string) => {
      const originalItem = unarrangedTask.value.find(task => task.id === key);
      if (originalItem) {
        taskStore.updateTaskPriority(originalItem.id  ,'none')
        const item = {     key: originalItem.id,
          title: `${originalItem.id} - ${originalItem.title}` };
        [datalist1, datalist2, datalist3].forEach(list => {
          if (!list.value.some(i => i.key === item.key)) {
            list.value.push(item);
          }
        });
      }
    });
  }
};

// 样式相关工具函数
const getPriorityColor = (priority: TaskPriority): string => {
  return {
    medium:'#d9d9d9',
    urgent: '#ff4d4f',
    high: '#faad14',
    low: '#52c41a',
    none: '#d9d9d9'
  }[priority];
};

const getPriorityClass = (task: Task): string => {
  return task.status === 'done'
    ? 'task-done' // 新样式
    : `priority-${task.priority}`;
};

// Transfer组件项渲染器
const renderFunc = (item: { title: string }) => item.title;

</script>

<style scoped lang="less">
.kanban-container {
  /* 添加以下样式 */
  height: 75vh; /* 根据视口高度设置 */
  overflow-y: auto; /* 启用垂直滚动 */
  display: flex;
  flex-direction: column; /* 保持内部布局结构 */

  /* 原有样式保持不变 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 16px auto;
  max-width: 1200px;
}

/* 分割线头部布局 */
.custom-divider .divider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 16px;

  .header-left {
    display: flex;
    align-items: center;
    
    .divider-tag {
      font-size: 14px;
      padding: 6px 12px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .priority-tabs {
      display: flex;
      gap: 8px;
      background: #fff;
      padding: 4px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);

      .tab-item {
        position: relative;
        padding: 8px 20px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
          background: #f5f5f5;
        }

        &.active {
          background: #f0f5ff;
          
          .tab-label {
            color: #1890ff;
            font-weight: 500;
          }
          
          .indicator {
            width: 100%;
            background: #1890ff;
          }
        }
      }

      .tab-label {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        transition: color 0.3s;
      }

      .tab-count {
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }

      .indicator {
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: transparent;
        transition: all 0.3s;
      }
    }

    .custom-button {
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

/* 看板内容区域 */
.kanban-content {
  position: relative;
  min-height: 420px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;

  .priority-kanban {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 24px;
    background: #fff;
    transition: opacity 0.3s;

    &.urgent-kanban { border-top: 3px solid #ff4d4f; }
    &.high-kanban { border-top: 3px solid #faad14; }
    &.low-kanban { border-top: 3px solid #52c41a; }
  }
}

/* Transfer组件样式 */
:deep(.custom-transfer) {
  height: 360px;
  display: flex;
  gap: 24px;

  .ant-transfer-list {
    flex: 1;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
    
    &-header {
      background: #fafafa;
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
      
      &-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    
    &-body {
      height: calc(100% - 46px);
      padding: 8px;
      
      &-search-wrapper {
        padding: 0 8px 8px;
      }
      
      &-content-item {
        margin: 4px 0;
        padding: 10px 12px;
        border-radius: 4px;
        transition: all 0.2s;
        
        &:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          background: #fafafa;
        }
      }
    }
  }
}

/* 任务列表样式（保持原有实现） */
.task-section {
  margin-top: 32px;

  .task-controls {
    margin-bottom: 16px;
    
    .control-button {
      height: 32px;
      border-radius: 4px;
    }
  }

  .task-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .task-card {
    /* 保持原有卡片样式 */
  }
}

.task-done {
  border: 2px solid #52c41a;
  background: #f6ffed;
  opacity: 0.8;
}
</style>