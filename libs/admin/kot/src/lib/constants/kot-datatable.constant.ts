import { FlagType } from '@hospitality-bot/admin/shared';

export const kotStatusDetails: Record<
  string,
  { label: string; type: FlagType; color: string }
> = {
  '0mins': {
    label: 'Between 0-5Mins',
    type: 'success',
    color: '#000000',
  },
  '5mins': {
    label: 'Between 5-10Mins',
    type: 'active',
    color: '#FEB30B',
  },
  '10mins': {
    label: 'Between 10-15Mins',
    type: 'completed',
    color: '#FF9F40',
  },
  '15mins': {
    label: 'Between 15-20Mins',
    type: 'failed',
    color: '#F43636',
  },
  '20mins': {
    label: 'Above 20Mins',
    type: 'draft',
    color: '#F43636',
  },
};
