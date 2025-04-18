# DissertationProject

A modern web application built with Vue 3, TypeScript, and Vite, designed to support dissertation projects with efficient scheduling, task management, and communication features.

## 🚀 Tech Stack

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) (presumed for state management)
- [Less](https://lesscss.org/) (CSS pre-processor)

## 📂 Project Structure

```bash
dissertationProject/
├── public/                # Static assets (e.g., logos)
├── src/
│   ├── components/         # Core UI components (Calendar, Kanban, Inbox, etc.)
│   ├── data/               # Mock data (contacts, emails, tasks, etc.)
│   ├── stores/             # State management modules (UI, tasks, emails, events)
│   ├── utils/              # Utility functions and validators
│   ├── views/              # Application views (Main Frame, HelloWorld)
│   ├── styles/             # Global styles and theme variables
│   ├── router/             # Routing configuration
│   ├── App.vue             # Root component
│   ├── main.ts             # Entry point
├── index.html              # HTML template
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig*.json          # TypeScript configurations


Getting Started

Clone the repository
git clone https://github.com/Xu-Morgen/DissertationProject.git
cd dissertationProject

Install dependencies
npm install

Start the development server
npm run dev

Build for production
npm run build