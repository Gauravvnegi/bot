import {
  DualPlotDataset,
  PermissionModuleNames,
  StatCard,
} from '@hospitality-bot/admin/shared';

export const eMarketWhatsappStatCard: StatCard[] = [
  {
    label: 'Total Sent',
    key: 'Resolved',
    score: 0,
    additionalData: '0',
    id: 'sent',
  },
  {
    label: 'Total Read',
    key: 'Timedout',
    score: 0,
    additionalData: '0',
    id: 'read',
  },
  {
    label: 'Total Delivered',
    key: 'InProgress',
    score: 0,
    additionalData: '0',
    id: 'delivered',
  },
  {
    label: 'Delivered Rate',
    key: 'ToDo',
    score: 0,
    additionalData: '0',
    id: 'deliveryRate',
  },
];
export const eMarketEmailStatCard: StatCard[] = [
  {
    label: 'Total Delivered',
    key: 'Resolved',
    score: 0,
    additionalData: '0',
    id: 'delivered',
  },
  {
    label: 'Total Open',
    key: 'Timedout',
    score: 0,
    additionalData: '0',
    id: 'opened',
  },
  {
    label: 'Total Clicks',
    key: 'InProgress',
    score: 0,
    additionalData: '0',
    id: 'clicked',
  },
  {
    label: 'Conversion Rate',
    key: 'ToDo',
    score: 0,
    additionalData: '0',
    id: 'conversionRate',
  },
];

export const eMarketTabFilterOptions: {
  label: string;
  value: 'EMAIL' | 'WHATSAPP';
  moduleName: PermissionModuleNames;
}[] = [
  {
    label: 'Email',
    value: 'EMAIL',
    moduleName: PermissionModuleNames.EMAIL_CAMPAIGN,
  },
  {
    label: 'Whatsapp',
    value: 'WHATSAPP',
    moduleName: PermissionModuleNames.WHATSAPP_CAMPAIGN,
  },
];

export const eMarketWhatsappStat: DualPlotDataset[] = [
  {
    data: [0],
    fill: true,
    label: 'sent',
    backgroundColor: '#4BA0F5',
    borderColor: '#4BA0F5',
    pointBackgroundColor: '#4BA0F5',
    id: 'sentEventStats',
  },
  {
    data: [0],
    fill: true,
    label: 'Delivered',
    backgroundColor: '#FF9F40',
    borderColor: '#FF9F40',
    pointBackgroundColor: '#FF9F40',
    id: 'deliveredEventStats',
  },
  {
    data: [0],
    fill: true,
    label: 'Read',
    backgroundColor: '#4BC0C0',
    borderColor: '#4BC0C0',
    pointBackgroundColor: '#4BC0C0',
    id: 'readEventStats',
  },
];

export const eMarketEmailStat: DualPlotDataset[] = [
  {
    data: [0],
    fill: true,
    label: 'Delivered',
    backgroundColor: '#4BA0F5',
    borderColor: '#4BA0F5',
    pointBackgroundColor: '#4BA0F5',
    id: 'deliveredEventStats',
  },
  {
    data: [0],
    fill: true,
    label: 'Open',
    backgroundColor: '#FF9F40',
    borderColor: '#FF9F40',
    pointBackgroundColor: '#FF9F40',
    id: 'openEventStats',
  },
  {
    data: [0],
    fill: true,
    label: 'Click',
    backgroundColor: '#4BC0C0',
    borderColor: '#4BC0C0',
    pointBackgroundColor: '#4BC0C0',
    id: 'clickedEventStats',
  },
];
