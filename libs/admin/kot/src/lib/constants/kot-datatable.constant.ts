import { FlagType } from '@hospitality-bot/admin/shared';

export const kotStatusDetails: Record<
  string,
  { label: string; type: FlagType; color: string }
> = {
  '5mins': {
    label: 'Between 5-10min',
    type: 'active',
    color: '#FEB30B',
  },
  '10mins': {
    label: 'Between 10-15min',
    type: 'completed',
    color: '#FF9F40',
  },
  '15mins': {
    label: 'Between 15-20min',
    type: 'failed',
    color: '#F43636',
  },
  '20mins': {
    label: 'Above 20min',
    type: 'draft',
    color: '#F43636',
  },
};
