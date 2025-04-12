

export const EMERGENCY_TEMPLATES = {
  server_down: {
    id: "server_down",
    autoGenerate: {
      email: {
        subject: "[紧急] 服务器故障处理",
        content: "需要立即处理的服务器宕机事件",
        recipients: "devops"
      },
      meeting: {
        templateId: "tech_emergency",
        daysAfter: 1
      }
    }
  }
} as const;