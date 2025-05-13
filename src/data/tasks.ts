import type { PersonalTask, Task } from '@/types';



const TASK_TEMPLATES: Record<string, Omit<Task, 'id' | 'createdAt'>> = {
  analytics: {
    title: 'User analysis panel',
    description: 'Develop user behavior analysis functions',
    status: 'backlog',
    priority: 'none',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress:0,
  },
  test:{
    title: "test task",
    description: 'this is a test task',
    status: 'backlog',
    priority: 'none',
    blocked: false,
    creator: 'boss',
    progress:0,
    storyPoints:18,
  }
};

const PERSONAL_TASK:PersonalTask[]=[
  {
    id: 'first_email',
    title: 'Tutorial: First Email',
    description: 'Click on the first email in your inbox to view the details',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  {
    id: 'first_reply',
    title: 'Tutorial: First Sent',
    description: 'Click on the Send Email button in the upper right corner to send your report email to the boss.',
    status: 'todo',
    creator: 'client',
    createdAt: 0
  },
  { 
    id:'first_kanban_work',
    title:"Tutorial: First kanban work",
    description:"Click Kanban in the lower left corner to add new engineering tasks to urgent, and send a report to the Scurm team after the adjustment is completed.",
    status:'todo',
    creator:'client',
    createdAt:0
  },
  { 
    id:'first_meeting',
    title:"Tutorial: Arrange a meeting via email",
    description:"Click the Send Email button, select the Scrum team, and hold an orientation meeting today",
    status:'todo',
    creator:'client',
    createdAt:0
  },
  { 
    id:'first_day',
    title:"The tutorial has ended",
    description:"Please click Next Day to officially start the game, click the Next Day button in the lower right corner",
    status:'todo',
    creator:'client',
    createdAt:0
  },
]


export const TASK_TEMPLATES_AUTO: Record<string, Omit<Task, 'id' | 'createdAt'>> = {
  task_login_api: {
    title: 'Implement Login API',
    description: 'Build and secure the user login API.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_user_dashboard: {
    title: 'User Dashboard UI',
    description: 'Design user dashboard for real-time metrics.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_kanban_refactor: {
    title: 'Refactor Kanban Board',
    description: 'Simplify logic and improve performance of kanban system.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 13,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_api_throttle: {
    title: 'API Rate Limiting',
    description: 'Add rate limiting to public endpoints.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_ci_cd: {
    title: 'Setup CI/CD Pipeline',
    description: 'Automate build and deployment process.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_test_suite: {
    title: 'Add Unit Tests',
    description: 'Increase test coverage across core modules.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_bug_hunt: {
    title: 'Resolve Reported Bugs',
    description: 'Fix known issues from client feedback.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_onboarding_flow: {
    title: 'Redesign Onboarding Flow',
    description: 'Improve first-time user experience with updated UI.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_db_migration: {
    title: 'Database Schema Migration',
    description: 'Migrate from legacy schema to new design.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_feedback_widget: {
    title: 'Implement Feedback Widget',
    description: 'Allow users to send feedback within the app.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 2,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_security_audit: {
    title: 'Conduct Security Audit',
    description: 'Review system for potential security vulnerabilities.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_mobile_responsive: {
    title: 'Make UI Mobile Responsive',
    description: 'Ensure full compatibility with mobile devices.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_analytics_dashboard: {
    title: 'Analytics Dashboard',
    description: 'Provide visual reporting on key user metrics.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_dark_mode: {
    title: 'Add Dark Mode',
    description: 'Support UI dark mode for better accessibility.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_docs_refactor: {
    title: 'Refactor Developer Docs',
    description: 'Reorganize and update internal documentation.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 2,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_payment_gateway: {
    title: 'Integrate Payment Gateway',
    description: 'Enable secure payment options with third-party service.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_ai_recommendation: {
    title: 'Build Recommendation System',
    description: 'Use ML to suggest content for users.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 8,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_crash_report: {
    title: 'Implement Crash Reporting',
    description: 'Add real-time crash and error tracking.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_customer_chat: {
    title: 'Customer Chat Integration',
    description: 'Enable real-time support chat in app.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_email_templates: {
    title: 'Design Email Templates',
    description: 'Create reusable and branded email layouts.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_multilang_support: {
    title: 'Add Multi-language Support',
    description: 'Support internationalization with i18n framework.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_server_monitor: {
    title: 'Server Monitoring Setup',
    description: 'Deploy system metrics and uptime dashboard.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_autosave_feature: {
    title: 'Implement Auto-Save',
    description: 'Prevent data loss by saving drafts automatically.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_data_backup: {
    title: 'Data Backup System',
    description: 'Setup regular automatic backups.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_beta_feedback: {
    title: 'Collect Beta Feedback',
    description: 'Set up beta tester system and feedback form.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_role_permissions: {
    title: 'User Roles & Permissions',
    description: 'Add role-based access to admin/user dashboards.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 13,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_push_notifications: {
    title: 'Push Notification System',
    description: 'Enable mobile/web push alerts.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_ux_review: {
    title: 'Conduct UX Review',
    description: 'Evaluate and improve UI/UX experience.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_websocket_chat: {
    title: 'WebSocket Chat Module',
    description: 'Build real-time chat with WebSocket.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 13,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_user_activity_log: {
    title: 'User Activity Logging',
    description: 'Track user actions for audit trail.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_a11y_review: {
    title: 'Accessibility Review (A11Y)',
    description: 'Ensure WCAG 2.1 compliance across the UI.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_cookie_consent: {
    title: 'GDPR Cookie Consent Banner',
    description: 'Add legal compliance banner for user consent.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 2,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_ai_chatbot: {
    title: 'Deploy AI Chatbot',
    description: 'Provide automated support using a chatbot.',
    status: 'backlog',
    priority: 'urgent',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_referral_program: {
    title: 'Referral System Setup',
    description: 'Reward users for referring new signups.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_benchmarking: {
    title: 'Benchmark App Performance',
    description: 'Test system under high traffic conditions.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_calendar_sync: {
    title: 'Calendar Sync Integration',
    description: 'Integrate with Google/Outlook Calendar.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_code_review_policy: {
    title: 'Define Code Review Policy',
    description: 'Create team-wide review & merge standards.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_session_timeout: {
    title: 'Auto Session Timeout',
    description: 'Secure login sessions with auto-expiry.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_voice_command: {
    title: 'Voice Command Prototype',
    description: 'Enable navigation via voice input (demo only).',
    status: 'backlog',
    priority: 'low',
    storyPoints: 2,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_offline_mode: {
    title: 'Add Offline Mode',
    description: 'Make app usable when offline using local cache.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_theme_customizer: {
    title: 'Theme Customizer',
    description: 'Allow users to customize colors & fonts.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_data_export: {
    title: 'Data Export Function',
    description: 'Enable export of reports to CSV and PDF.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_devtools_plugin: {
    title: 'Create DevTools Plugin',
    description: 'Build Chrome DevTools extension for debugging.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_feature_flag: {
    title: 'Feature Flag System',
    description: 'Roll out features gradually with flags.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_internal_wiki: {
    title: 'Internal Team Wiki',
    description: 'Set up centralized knowledge base.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 3,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_usability_test: {
    title: 'Run Usability Testing',
    description: 'Test flows with real users for feedback.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_invoice_system: {
    title: 'Invoice Generation',
    description: 'Build downloadable invoice system.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'boss',
    blocked: false,
    progress: 0
  },
  task_public_roadmap: {
    title: 'Publish Product Roadmap',
    description: 'Make roadmap public and trackable.',
    status: 'backlog',
    priority: 'low',
    storyPoints: 2,
    creator: 'client',
    blocked: false,
    progress: 0
  },
  task_ai_summary: {
    title: 'AI-Generated Summaries',
    description: 'Use LLMs to summarize user activity and data.',
    status: 'backlog',
    priority: 'high',
    storyPoints: 8,
    creator: 'player',
    blocked: false,
    progress: 0
  },
  task_gamification: {
    title: 'Gamify User Experience',
    description: 'Add XP and badges to increase engagement.',
    status: 'backlog',
    priority: 'medium',
    storyPoints: 5,
    creator: 'client',
    blocked: false,
    progress: 0
  }
};





export default {TASK_TEMPLATES,PERSONAL_TASK,TASK_TEMPLATES_AUTO} 