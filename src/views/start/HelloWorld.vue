<template>
    <div class="consent-page">
      <h1>Fantasy Software Development - Research Study</h1>
  
      <section>
        <p>
          You are being invited to participate in a research study titled <strong>Fantasy Software Development</strong>. This study is being conducted by Jiahui Xu from the BSc in Computer Science at the University of Sheffield.
        </p>
      </section>
  
      <section>
        <h2>Project Overview</h2>
        <p><strong>Project Title:</strong> Fantasy Software Development</p>
        <p><strong>Researcher:</strong> Jiahui Xu</p>
      </section>
  
      <section>
        <h2>What is the project’s purpose?</h2>
        <p>
          This project aims to address the lack of electronic education in software engineering management education by exploring the feasibility of gamified learning. You will play a prototype educational game and provide feedback through a post-session questionnaire.
        </p>
      </section>
  
      <section>
        <h2>Why have I been chosen?</h2>
        <p>
          You are a university student with a background in computer science but without formal training in software engineering management. A total of 10 participants will be involved in this study.
        </p>
      </section>
  
      <section>
        <h2>Do I have to take part?</h2>
        <p>
          Participation is voluntary. You may withdraw at any time without giving a reason and without negative consequences. Due to the anonymous nature of the data, once submitted, responses cannot be altered.
        </p>
      </section>
  
      <section>
        <h2>What will I do if I participate?</h2>
        <p>
          - Read this consent page and give your agreement.<br />
          - Play a prototype educational game (45–60 minutes).<br />
          - Complete a follow-up questionnaire (15 minutes).
        </p>
      </section>
  
      <section>
        <h2>Risks and Benefits</h2>
        <p>
          There are no direct risks or benefits. The main cost is your time. The game is for educational and research purposes only and not professional training.
        </p>
      </section>
  
      <section>
        <h2>Confidentiality & Data Use</h2>
        <p>
          Your personal data will remain confidential and anonymous. The University of Sheffield is the Data Controller and will protect your information in accordance with its Privacy Notice.
        </p>
      </section>
  
      <section>
        <h2>Ethical Review</h2>
        <p>
          This project has been ethically approved by the School of BSc Computer Science at the University of Sheffield.
        </p>
      </section>
  
      <section>
        <h2>Concerns or Complaints</h2>
        <p>
          If you have any concerns, please contact:<br />
          Researcher: <a href="mailto:jxu137@sheffield.ac.uk">jxu137@sheffield.ac.uk</a><br />
          Supervisor: <a href="mailto:j.rojas@sheffield.ac.uk">j.rojas@sheffield.ac.uk</a><br />
          Head of Department: <a href="mailto:heidi.christensen@sheffield.ac.uk">heidi.christensen@sheffield.ac.uk</a>
        </p>
      </section>
  
      <section class="consent-final">
        <p>
          Your participation is entirely voluntary, and you may skip any question or withdraw at any time. If you are ready to begin, please click the button below.
        </p>
        <button class="start-button" @click="startSurvey">Start</button>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
import router from '@/router';

  const startSurvey = () => {
    router.push('/main')
  };
  </script>
  
  <style scoped>
  .consent-page {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 12px;
    font-family: 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  h2 {
    margin-top: 1.5rem;
    font-size: 1.2rem;
    color: #34495e;
  }
  
  section {
    margin-bottom: 1.5rem;
  }
  
  a {
    color: #1a73e8;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  .start-button {
    margin-top: 1rem;
    background-color: #1677ff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .start-button:hover {
    background-color: #0958d9;
  }
  </style>
  