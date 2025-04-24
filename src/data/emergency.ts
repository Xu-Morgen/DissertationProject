import type { EmergencyTemplate } from "@/types";

// 模板定义
export const EMERGENCY_TEMPLATES: Record<string, EmergencyTemplate> = {
  server_crash: {
    id: 'server_crash',
    title: 'Production Server Crash',
    autoGenerate: {
      email: {
        subject: '[Alert] Production Server is Down',
        content: 'Our backend service is not responding. Immediate fix needed.',
        recipients: ['devops']
      },  
      meeting: {
        templateId: 'server_incident',
        daysAfter: 1
      }
    },
    effects: {
      blockKeywords: ['api', 'server']
    }
  },
  ai_speed_boost: {
    id: 'ai_speed_boost',
    title: 'AI Code Optimizer Deployed',
    autoGenerate: {
      email: {
        subject: '[System Prompt] The AI accelerator is now live',
        content: 'Ai-assisted programming tools have been deployed, and productivity will be significantly enhanced!',
        recipients: ['team']
      }
    },
    effects: {
      boostWorker: true
    }
  },
  
  db_corruption: {
    id: 'db_corruption',
    title: 'Database Corruption Detected',
    autoGenerate: {
      meeting: {
        templateId: 'data_emergency',
        daysAfter: 1
      }
    },
    effects: {
      blockKeywords: ['database', 'query']
    }
  },
  pr_conflict: {
    id: 'pr_conflict',
    title: 'Massive PR Conflict',
    autoGenerate: {
      email: {
        subject: '[Urgent] PR Merge Failure',
        content: 'Too many PRs conflicting with main. Coordination required.',
        recipients: ['tech_lead', 'qa']
      }
    },
    effects: {
      blockKeywords: ['refactor', 'merge']
    }
  },
  customer_revenue: {
    id: 'customer_revenue',
    title: 'Customer Boost',
    autoGenerate: {
      email: {
        subject: '[Success] New Client Landed!',
        content: 'Client signed a high-value contract, speed is key!',
        recipients: ['team']
      }
    },
    effects: {
      boostWorker: true
    }
  },
  system_update: {
    id: 'system_update',
    title: 'Critical OS Patch Required',
    autoGenerate: {
      meeting: {
        templateId: 'ops_patch_meeting',
        daysAfter: 2
      }
    },
    effects: {
      blockKeywords: ['deployment', 'system']
    }
  },
  hr_conflict: {
    id: 'hr_conflict',
    title: 'Team Conflict Reported',
    autoGenerate: {
      meeting: {
        templateId: 'hr_conflict_resolution',
        daysAfter: 1
      }
    },
    effects: {
      blockKeywords: ['team', 'collaboration']
    }
  },
  ci_failure: {
    id: 'ci_failure',
    title: 'CI/CD Pipeline Broken',
    autoGenerate: {
      email: {
        subject: '[Pipeline Down]',
        content: 'CI jobs not passing. Deployment halted.',
        recipients: ['devops']
      }
    },
    effects: {
      blockKeywords: ['ci', 'cd', 'deploy']
    }
  },
  audit_coming: {
    id: 'audit_coming',
    title: 'External Audit Scheduled',
    autoGenerate: {
      meeting: {
        templateId: 'audit_checklist',
        daysAfter: 3
      }
    }
  },
  tech_debt_overflow: {
    id: 'tech_debt_overflow',
    title: 'Tech Debt Overload',
    autoGenerate: {
      email: {
        subject: '[Tech Debt Warning]',
        content: 'Refactor tickets overdue. May affect performance.',
        recipients: ['tech_lead']
      }
    },
    effects: {
      blockKeywords: ['refactor', 'legacy']
    }
  },

  // ✅ 再生成 11 条轻型事件作为补充
  api_limit_reached: {
    id: 'api_limit_reached',
    title: 'API Rate Limit Hit',
    effects: {
      blockKeywords: ['api', 'request']
    }
  },
  vendor_integration_fail: {
    id: 'vendor_integration_fail',
    title: 'Vendor API Integration Failed',
    effects: {
      blockKeywords: ['vendor', 'integration']
    }
  },
  positive_press: {
    id: 'positive_press',
    title: 'Positive Press Coverage',
    autoGenerate: {
      email: {
        subject: '[News Flash] Our company has received positive media coverage.',
        content: 'The latest news praises our teams innovative performance, and morale has soared!',
        recipients: ['team']
      }
    },
    effects: {
      boostWorker: true
    }
  },
  office_move: {
    id: 'office_move',
    title: 'Office Migration Incoming',
    autoGenerate: {
      meeting: {
        templateId: 'ops_move_plan',
        daysAfter: 2
      }
    }
  },
  legal_policy_change: {
    id: 'legal_policy_change',
    title: 'Policy Update Required',
    autoGenerate: {
      email: {
        subject: 'Review New Company Policy',
        content: 'Legal has issued mandatory changes.',
        recipients: ['legal', 'ops']
      }
    }
  },
  team_building: {
    id: 'team_building',
    title: 'Team Building Day',
    autoGenerate: {
      email: {
        subject: '[Reminder] The team-building activity starts today',
        content: 'We have arranged a team-building activity this afternoon. Please relax and have fun!',
        recipients: ['team']
      }
    },
    effects: {
      boostWorker: true
    }
  },
  internal_survey: {
    id: 'internal_survey',
    title: 'Employee Satisfaction Survey',
    autoGenerate: {
      email: {
        subject: 'Please Fill Internal Survey',
        content: 'We need your feedback this week.',
        recipients: ['team']
      }
    }
  },
  infra_reboot: {
    id: 'infra_reboot',
    title: 'Infrastructure Restart Required',
    effects: {
      blockKeywords: ['infra', 'restart']
    }
  },
  finance_alert: {
    id: 'finance_alert',
    title: 'Finance Department Alert',
    autoGenerate: {
      email: {
        subject: '[Finance Alert]',
        content: 'Budget overspent. New task limits incoming.',
        recipients: ['finance']
      }
    }
  },
  ai_glitch: {
    id: 'ai_glitch',
    title: 'AI Misfire Detected',
    autoGenerate: {
      meeting: {
        templateId: 'ai_checkin',
        daysAfter: 1
      }
    },
    effects: {
      blockKeywords: ['ai', 'automation']
    }
  },
  toolchain_upgrade: {
    id: 'toolchain_upgrade',
    title: 'Toolchain Upgrade Completed',
    autoGenerate: {
      email: {
        subject: '[Notice] The toolchain update has been completed',
        content: 'The new version of the toolchain has been enabled, and the development efficiency will be improved.',
        recipients: ['devops', 'tech_lead']
      }
    },
    effects: {
      boostWorker: true
    }
  },
  staff_sick_leave: {
    id: 'staff_sick_leave',
    title: 'Key Developer on Sick Leave',
    autoGenerate: {
      email: {
        subject: '[Notice] Employee is on sick leave',
        content: 'A key member of the development team will be on vacation for three days. Please adjust the arrangement.',
        recipients: ['team']
      },
      meeting: {
        templateId: 'hr_sick_meeting',
        daysAfter: 2
      }
    },
    effects: {
      custom: 'decrease_worker_temporarily'
    }
  }
  
};
