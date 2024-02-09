import { Chip, EntityState, FlagType } from '@hospitality-bot/admin/shared';

export const kotStatusDetails: Record<
  string,
  { label: string; type: FlagType; color: string }
> = {
  '5mins': {
    label: 'Crossed 5Mins',
    type: 'active',
    color: '#FEB30B',
  },
  '10mins': {
    label: 'Crossed 10Mins',
    type: 'completed',
    color: '#FF9F40',
  },
  '15mins': {
    label: 'Crossed 15Mins',
    type: 'failed',
    color: '#F43636',
  },
  '20mins': {
    label: 'Crossed 20Mins',
    type: 'draft',
    color: '#F43636',
  },
};
