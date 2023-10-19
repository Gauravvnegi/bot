import { FlagType } from '@hospitality-bot/admin/shared';

export enum ChipType {
  'Reject' = 'new',
  'Accept' = 'completed',
  'Closed' = 'failed',
  'Pending' = 'initiated',
  'Timeout' = 'new',
}

export const inhouseStatus: Record<
  'Closed' | 'Pending' | 'Timeout' | 'Todo' | 'Accept' | 'Reject',
  { label: string; type: FlagType }
> = {
  Closed: {
    label: 'Closed',
    type: 'failed',
  },
  Pending: {
    label: 'Pending',
    type: 'warning',
  },
  Timeout: {
    label: 'Timeout',
    type: 'default',
  },
  Todo: {
    label: 'Todo',
    type: 'active',
  },
  Accept: {
    label: 'Accept',
    type: 'completed',
  },
  Reject: {
    label: 'Reject',
    type: 'failed',
  },
};
