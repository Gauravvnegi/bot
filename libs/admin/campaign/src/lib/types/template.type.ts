import { TemplateType } from './campaign.type';

export type TemplateData = {
  active: boolean;
  createdAt: number;
  createdBy: string;
  description: string;
  entityId: string;
  htmlTemplate: string;
  id: string;
  isShared: boolean;
  name: string;
  templateType: TemplateType;
  topicId: string;
  updatedAt: number;
  updatedBy: string;
  userId: string;
};

export type TopicTemplatesData = {
  templates: TemplateData[];
  topicId?: string;
  topicName?: string;
  totalTemplate: number;
};
