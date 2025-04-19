<template>
  <div class="survey-page">
    <h1>感谢你的游玩！</h1>
    <p>请填写以下问卷帮助我们改进产品：</p>

    <!-- 调查问卷链接 -->
    <a
      class="survey-link"
      href="https://docs.google.com/forms/d/e/1FAIpQLSeXSA-_Bl3ubwSKu3aZcrTOp3-qSDB0RvOehRtEMW7L60VZ7w/viewform?usp=dialog"
      target="_blank"
    >
      👉 点此填写问卷
    </a>

    <div class="consent-text">
      <p>
        By clicking the <strong>‘Submit’</strong> button below, you are consenting to participate in this study,
        as it is described in the participant information sheet.
        If you have not yet downloaded a copy of this document for your records, we recommend that you do that now.
      </p>

      <!-- 可选：下载知情书按钮 -->
      <a
        href="/dissertationProject/src/docs/consent form.docx"
        download
        class="download-link"
      >
        📄 下载知情同意书
      </a>

      <a
        href="/dissertationProject/src/docs/Participant information sheet.docx"
        download
        class="download-link"
      >
        📄 下载实验内容说明书
      </a>

      
      <a
        href="/dissertationProject/src/docs/question paper.docx"
        download
        class="download-link"
      >
        📄 下载问卷内容
      </a>



    </div>
  </div>
</template>

<script setup lang="ts">
// 你可以在此处添加表单提交前逻辑、打点、分析上传等
const handleSubmit = () => {
  // 假设点击后跳转到实际 Google Form 链接
  window.open('https://your-survey-link.com', '_blank');
};
</script>

<style scoped>
.survey-page {
  padding: 2rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
}

.survey-link {
  display: inline-block;
  font-size: 1.1rem;
  margin: 1rem 0;
  color: #1677ff;
  text-decoration: none;
  font-weight: bold;
}

.survey-link:hover {
  text-decoration: underline;
}

.consent-text {
  margin-top: 2rem;
  text-align: left;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.download-link {
  display: block;
  margin: 1rem 0;
  color: #1677ff;
}

.submit-button {
  margin-top: 1rem;
}
</style>
