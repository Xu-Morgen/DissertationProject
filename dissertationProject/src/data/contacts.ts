import type { Recipient } from "@/types";

const CONTACTS: Recipient[] =  [
    {
        id: 'boss',
        name: '项目经理',
        email: 'boss@company.com',
        isUnlocked: true,
        signature: '请及时跟进项目进度'
    },
    {
        id: 'client',
        name: '主要客户',
        email: 'client@corp.com',
        isUnlocked: true,
        signature: '期待您的回复'
    },
    {
        id: 'team',
        name: '项目团队',
        email: 'client@corp.com',
        isUnlocked: true,
        signature: '期待您的回复'
    }
]

export default {CONTACTS}