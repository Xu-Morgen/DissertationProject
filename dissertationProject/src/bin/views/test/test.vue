<template>

    <a-button @click="initCloseHandler">启用安全关闭功能</a-button>

  </template>
  
  <script>
  export default {
    data() {
      return {
        hasUnsavedChanges: false // 通过业务逻辑更新此状态
      }
    },
  
    mounted() {
      window.addEventListener('beforeunload', this.handleBeforeUnload)
    },
  
    methods: {
        initCloseHandler(){this.hasUnsavedChanges = true},
      handleBeforeUnload(event) {
        if (this.hasUnsavedChanges) {
          // 触发浏览器原生提示
          alert("触发")
          event.returnValue = '自定义消息（现代浏览器不再显示）'
        }
      }
    },
  
    beforeUnmount() {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
    }
  }
  </script>
  
  <style>
  /* 自定义模态框样式 */
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-modal-footer {
    display: flex;
    justify-content: space-between;
  }
  </style>