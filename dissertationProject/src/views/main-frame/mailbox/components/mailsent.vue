<template>
  <a-modal
    :open="open"
    title="Compose New Email"
    @ok="handleSend"
    @cancel="emit('update:open', false)"
    destroyOnClose
  >
    <!-- 选择 Email（带自动完成功能） -->
    <a-auto-complete
      v-model:value="selectedSubject"
      :options="emailOptions"
      placeholder="Select or enter email subject"
      style="width: 100%; margin-bottom: 10px"
      @select="handleEmailSelect"
    />

    <!-- 自动匹配的 Type 选择框 -->
    <a-select
      v-model:value="selectedType"
      placeholder="Select Type"
      style="width: 100%; margin-bottom: 10px"
      :options="typeOptions"
      disabled
    />

    <!-- 基于 Type 提供格式化回复 -->
    <a-select
      v-model:value="selectedTemplate"
      placeholder="Select Email Template"
      style="width: 100%; margin-bottom: 10px"
      :options="templateOptions"
    />

    <!-- 动态模板内容编辑区域 -->
    <a-input
      v-model:value="templateContent"
      placeholder="Enter content"
      style="width: 100%; margin-bottom: 10px"
    />

    <!-- 不可编辑的文本框显示选择的回复 -->
    <a-input
      v-model:value="selectedReply"
      placeholder="Selected Reply"
      style="width: 100%; margin-bottom: 10px"
      :readonly="true"
    />

    <template #footer>
      <a-button key="back" @click="emit('update:open', false)">Cancel</a-button>
      <a-button key="send" type="primary" @click="handleSend">Send</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
//用于在点击send new时触发的弹出框
import { ref, computed } from "vue";

// 接收 `open` 状态
const props = defineProps<{ open: boolean; emailList: { subject: string; type: string }[] }>();
const emit = defineEmits(["update:open", "sendEmail"]);

// 选择的 Email 主题 & 类型
const selectedSubject = ref<string>("");
const selectedType = ref<string>("");

// 选择的模板和动态内容
const selectedTemplate = ref<string>("");
const templateContent = ref<string>("");

// 选择的格式化回复
const selectedReply = ref<string>("");

// 模板内容（这里是示例模板内容，可以根据需求调整）
const templates = {
  template1: "Hello {name},\n\nPlease complete the task as soon as possible.",
  template2: "Hi Team,\n\nThe meeting is scheduled for {meetingTime}. Please be on time."
};

// 处理自动完成选项
const emailOptions = computed(() =>
  props.emailList.map(email => ({ value: email.subject }))
);

// 处理 Type 选项（动态匹配）
const typeOptions = computed(() => {
  return selectedSubject.value
    ? [{ value: selectedType.value, label: selectedType.value }]
    : [];
});

// 处理模板选项
const templateOptions = computed(() => {
  return [
    { value: "template1", label: "Task Template" },
    { value: "template2", label: "Meeting Template" }
  ];
});

// 处理模板内容
const updateTemplateContent = (template: string) => {
  if (template === "template1") {
    templateContent.value = templates.template1;
  } else if (template === "template2") {
    templateContent.value = templates.template2;
  }
};

// 选择 Email 时，自动更新 Type 和清空已填充内容
const handleEmailSelect = (subject: string) => {
  const email = props.emailList.find(email => email.subject === subject);
  if (email) {
    selectedType.value = email.type; // 设置 Type
    selectedReply.value = ""; // 清空已选的 Reply
  }
};

// 选择模板时，自动更新模板内容
const handleTemplateSelect = (template: string) => {
  selectedTemplate.value = template;
  updateTemplateContent(template);
};

// 发送邮件
const handleSend = () => {
  emit("sendEmail", {
    subject: selectedSubject.value,
    type: selectedType.value,
    reply: selectedReply.value,
    content: templateContent.value,
  });
  emit("update:open", false); // 关闭弹窗
};

</script>
