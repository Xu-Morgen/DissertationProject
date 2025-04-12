export const EMERGENCY_EVENTS = {
    server_down: {
      id: 'server_down',
      title: '服务器宕机紧急事件',
      description: '生产环境核心服务器宕机，需立即处理！',
      requiredRecipients: ['cto', 'devops'],
      solutionFormat: {
        id: 'emergency_meeting',
        subject: '紧急技术会议邀请',
        content: `我们面临严重的技术故障，需要立即召开紧急会议讨论解决方案。
                 请选择以下会议类型：`,
        relate: { id: 'cto', name: 'CTO' },
        type: 'meeting',
        meetingid: 'tech_emergency'
      }
    }
  };
  
  export const EMERGENCY_MEETINGS = {
    tech_emergency: {
      id: 'tech_emergency',
      type: 'emergency',
      title: '技术紧急会议',
      participants: { id: 'team', name: '技术团队' },
      canDelete: false,
      scripts: [] // 具体会议脚本
    }
  };