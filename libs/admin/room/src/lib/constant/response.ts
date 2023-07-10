import { FlagType } from '@hospitality-bot/admin/shared';
import { RoomFoStatus, RoomStatus } from '../types/service-response';

export const roomStatuses: RoomStatus[] = [
  'CLEAN',
  'INSPECTED',
  'OUT_OF_ORDER',
  'OUT_OF_SERVICE',
  'UNAVAILABLE',
];

export const roomStatusDetails: Record<
  RoomStatus | RoomFoStatus,
  { label: string; type: FlagType }
> = {
  CLEAN: {
    label: 'Clean',
    type: 'active',
  },
  INSPECTED: {
    label: 'Inspected',
    type: 'completed',
  },
  OUT_OF_SERVICE: {
    label: 'Out of Service',
    type: 'inactive',
  },
  OUT_OF_ORDER: {
    label: 'Out of Order',
    type: 'failed',
  },
  UNAVAILABLE: {
    label: 'Unavailable',
    type: 'unavailable',
  },
  VACANT: {
    label: 'Vacant',
    type: 'success',
  },
  OCCUPIED: {
    label: 'Occupied',
    type: 'inactive',
  },
  DIRTY: {
    label: 'Dirty',
    type: 'warning',
  },
};

