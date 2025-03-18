<template>
  <div class="kanban-container">
    <!-- 优先级看板 -->
    <a-divider orientation="left" class="priority-divider">
      <a-tag color="#2db7f5">任务优先级</a-tag>
    </a-divider>

    <div class="priority-kanbans">
      <div 
        v-for="priority in priorityConfigs" 
        :key="priority.value"
        class="kanban-column"
        :class="`priority-${priority.value}`"
      >
        <a-transfer
          :data-source="priority.dataSource"
          :target-keys="priority.targetKeys"
          :render="renderTaskTitle"
          :title="priority.title"
          @change="(t, d, m) => handlePriorityChange(t, d, m, priority.value)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue';
import { useTaskStore } from '@/stores';
import type { Task } from '@/types';

const taskStore = useTaskStore();

// 优先级配置
const priorityConfigs = ref([
  {
    value: 'urgent',
    title: '紧急（最高优先级）',
    targetKeys: [] as string[],
    dataSource: [] as Array<{ key: string; title: string }>
  },
  {
    value: 'high',
    title: '高优先级',
    targetKeys: [] as string[],
    dataSource: [] as Array<{ key: string; title: string }>
  },
  {
    value: 'medium',
    title: '中优先级',
    targetKeys: [] as string[],
    dataSource: [] as Array<{ key: string; title: string }>
  },
  {
    value: 'low',
    title: '低优先级',
    targetKeys: [] as string[],
    dataSource: [] as Array<{ key: string; title: string }>
  }
]);

// 获取所有可分配任务
const allTasks = computed(() => 
  taskStore.backlog.filter(t => 
    taskStore.currentSprint?.committedTasks.includes(t.id)
  )
);

// 初始化优先级看板数据
watchEffect(() => {
  const tasks = allTasks.value;
  
  priorityConfigs.value.forEach(config => {
    // 目标键：当前优先级下的任务ID
    config.targetKeys = tasks
      .filter(t => t.priority === config.value)
      .map(t => t.id);
      
    // 数据源：未分配的任务 + 当前优先级已分配的任务
    config.dataSource = tasks
      .filter(t => 
        !tasks.some(task => 
          task.priority && 
          task.priority !== config.value &&
          priorityConfigs.value
            .some(p => p.value === task.priority) ||
        t.priority === config.value
      )
      .map(t => ({
        key: t.id,
        title: t.title
      }));
  });
});

// 处理优先级变化
const handlePriorityChange = (
  targetKeys: string[],
  direction: 'left' | 'right',
  moveKeys: string[],
  priority: Task['priority']
) => {
  // 更新目标键
  const config = priorityConfigs.value.find(c => c.value === priority);
  if (config) config.targetKeys = targetKeys;

  // 更新任务优先级
  if (direction === 'right') {
    moveKeys.forEach(key => {
      taskStore.updateTaskPriority(key, priority);
    });
  } else {
    moveKeys.forEach(key => {
      taskStore.updateTaskPriority(key, 'unassigned');
    });
  }

  // 更新其他看板数据源
  updateDataSource(priority);
};

// 更新其他看板的数据源
const updateDataSource = (changedPriority: string) => {
  priorityConfigs.value.forEach(config => {
    if (config.value !== changedPriority) {
      config.dataSource = allTasks.value
        .filter(t => 
          !t.priority ||
          t.priority === config.value ||
          (t.priority === changedPriority && config.targetKeys.includes(t.id))
        )
        .map(t => ({ key: t.id, title: t.title }));
    }
  });
};

// 渲染任务标题
const renderTaskTitle = (item: { title: string }) => item.title;
</script>

<style scoped lang="less">
.priority-kanbans {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  .kanban-column {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 16px;
    
    &[class*="priority-"] {
      border-left: 4px solid;
    }
    
    &.priority-urgent { border-color: #ff4d4f; }
    &.priority-high { border-color: #faad14; }
    &.priority-medium { border-color: #52c41a; }
    &.priority-low { border-color: #d9d9d9; }
  }
}

:deep(.ant-transfer) {
  display: flex !important;
  gap: 24px;

  .ant-transfer-list {
    width: 100% !important;
    height: 400px;
    
    &-header {
      background: #fafafa;
      padding: 12px;
      
      &-title {
        font-size: 14px;
        font-weight: 500;
      }
    }

    &-body {
      .ant-transfer-list-content-item {
        padding: 8px;
        margin: 4px 0;
        transition: all 0.2s;
        
        &:hover {
          background: #f0f5ff;
          transform: translateX(2px);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .priority-kanbans {
    grid-template-columns: 1fr;
  }
  
  :deep(.ant-transfer) {
    flex-direction: column;
    
    .ant-transfer-list {
      height: 300px;
    }
  }
}
</style>