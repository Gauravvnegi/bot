import { StatCard } from '@hospitality-bot/admin/shared';

export const eMarketStatCard: StatCard[] = [
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

export const eMarketTabFilterOptions: {
  label: string;
  value: 'EMAIL' | 'WHATSAPP';
}[] = [
  {
    label: 'Email',
    value: 'EMAIL',
  },
  {
    label: 'Whatsapp',
    value: 'WHATSAPP',
  },
];
