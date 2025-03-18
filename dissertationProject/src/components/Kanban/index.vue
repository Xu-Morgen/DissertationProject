<template>
    <div class="kanban-container">
      <!-- Sprint 看板 -->
      <a-divider orientation="left" class="sprint-divider">
        <a-tag color="#87d068">
          <rocket-outlined /> 当前 Sprint
        </a-tag>
      </a-divider>
  
      <div class="sprint-kanban">
        <a-transfer
          v-model:target-keys="sprintTasks"
          :data-source="backlogTasks"
          :render="renderTaskTitle"
          @change="handleSprintChange"
        />
      </div>
  
      <!-- 优先级看板 -->
      <a-divider orientation="left" class="priority-divider">
        <a-tag color="#2db7f5">任务优先级</a-tag>
      </a-divider>
  
      <div class="priority-kanbans">
        <div 
          v-for="priority in priorities" 
          :key="priority.value"
          class="kanban-column"
          :class="`priority-${priority.value}`"
        >
          <h3 class="column-title">
            {{ priority.label }}
          </h3>
          <draggable
            v-model="priority.tasks"
            group="tasks"
            @end="handlePriorityChange(priority.value)"
          >
            <div
              v-for="task in priority.tasks"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <a-tag :color="getPriorityColor(task.priority)">
                  {{ taskStatusMap[task.status] }}
                </a-tag>
                <span class="task-title">{{ task.title }}</span>
              </div>
              <div class="task-body">
                <p class="task-description">{{ task.description }}</p>
                <div class="task-meta">
                  <span>故事点: {{ task.storyPoints || 0 }}</span>
                  <span v-if="task.deadline">
                    截止: 第 {{ task.deadline }} 天
                  </span>
                </div>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useTaskStore } from '@/stores';
  import { RocketOutlined } from '@ant-design/icons-vue';
  import type { Task } from '@/types';
  
  const taskStore = useTaskStore();
  
  // Sprint 看板数据
  const sprintTasks = computed({
    get: () => taskStore.currentSprint?.committedTasks || [],
    set: (value) => {
      if (taskStore.currentSprint) {
        taskStore.currentSprint.committedTasks = value;
      }
    }
  });
  
  const backlogTasks = computed(() => 
    taskStore.backlog
      .filter(t => !sprintTasks.value.includes(t.id))
      .map(t => ({
        key: t.id,
        title: t.title
      }))
  );
  
  // 优先级看板数据
  const priorities = ref([
    { value: 'urgent', label: '紧急', tasks: [] as Task[] },
    { value: 'high', label: '高', tasks: [] as Task[] },
    { value: 'medium', label: '中', tasks: [] as Task[] },
    { value: 'low', label: '低', tasks: [] as Task[] }
  ]);
  
  // 初始化优先级看板
  const updatePriorityTasks = () => {
    priorities.value.forEach(priority => {
      priority.tasks = taskStore.backlog.filter(
        t => t.priority === priority.value && 
             sprintTasks.value.includes(t.id)
      );
    });
  };
  
  // 渲染任务标题
  const renderTaskTitle = (item: { title: string }) => item.title;
  
  // 处理 Sprint 任务变化
  const handleSprintChange = (targetKeys: string[]) => {
    taskStore.currentSprint!.committedTasks = targetKeys;
    updatePriorityTasks();
  };
  
  // 处理优先级变化
  const handlePriorityChange = (priority: Task['priority']) => {
    priorities.value
      .flatMap(p => p.tasks)
      .forEach(task => {
        taskStore.updateTaskPriority(task.id, priority);
      });
  };
  
  // 任务状态映射
  const taskStatusMap = {
    backlog: '待处理',
    todo: '准备开始',
    inProgress: '进行中',
    done: '已完成'
  };
  
  // 优先级颜色映射
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#faad14';
      case 'medium': return '#52c41a';
      case 'low': return '#d9d9d9';
      default: return '#2db7f5';
    }
  };
  
  // 初始化数据
  updatePriorityTasks();
  </script>
  
  <style scoped lang="less">
  .kanban-container {
    padding: 24px;
    background: #f5f7fa;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .sprint-divider,
  .priority-divider {
    margin: 40px 0 24px;
    
    .ant-tag {
      font-size: 16px;
      padding: 8px 16px;
    }
  }
  
  .sprint-kanban {
    background: #f6ffed;
    border: 2px dashed #73d13d;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;
  }
  
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
  
    .column-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
  }
  
  .task-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 8px;
    transition: all 0.2s;
  
    &:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
  
    .task-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
  
      .task-title {
        font-size: 14px;
        font-weight: 500;
        margin-left: 8px;
      }
    }
  
    .task-body {
      .task-description {
        color: rgba(0, 0, 0, 0.85);
        line-height: 1.6;
        margin-bottom: 8px;
      }
  
      .task-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  
  @media (max-width: 768px) {
    .priority-kanbans {
      grid-template-columns: 1fr;
    }
  }
  </style>