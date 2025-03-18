import type { EmailTemplate } from './type';

export const EMAILS: Record<number, EmailTemplate> = {
  5001: {
    id: 5001,
    subject: "新人报到 - {姓名}",
    content: `尊敬的{上级称呼}：
    
    您好！我是新入职的{职位} {姓名}，将负责{部门}的{职责}工作。
    
    期待您的指导！`,
    variables: ['姓名', '职位', '部门', '职责', '上级称呼']
  }
};