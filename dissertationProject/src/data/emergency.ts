

export const EMERGENCY_TEMPLATES = {
  server_down: {
    id: "server_down",
    autoGenerate: {
      email: {
        subject: "[emergency] server killed",
        content: "please fix server",
        recipients: "devops"
      },
      meeting: {
        templateId: "tech_emergency",
        daysAfter: 1
      }
    }
  }
} as const;