import { StatCard } from '@hospitality-bot/admin/shared';

export const statCard: StatCard[] = [
  {
    label: 'Resolved',
    score: '50',
    additionalData: '100',
    comparisonPercent: 100,
    color: '#31bb92',
  },
  {
    label: 'Timed-out',
    score: '10',
    additionalData: '5',
    comparisonPercent: 100,
    color: '#ef1d45',
  },
  {
    label: 'In-Progress',
    score: '50',
    additionalData: '5',
    comparisonPercent: 100,
    color: '#4ba0f5',
  },
  {
    label: 'To Do',
    score: '5',
    additionalData: '100',
    comparisonPercent: 100,
    color: '#c5c5c5',
  },
];

export const getTicketCountLabel = (action: string, key: string) => {
  const keyPair = {
    Today: `${action}/Day`,
    Yesterday: `${action}/Day`,
    Tommorow: `${action}/Day`,
    'Last 7 Days': `${action}/Week`,
    'This Week': `${action}/Week`,
    'Next 7 Days': `${action}/Week`,
    'Last 30 Days': `${action}/Month`,
    'This Month': `${action}/Month`,
    'Last Month': `${action}/Month`,
    'Custom Range': action,
  };

  return keyPair[key];
};
