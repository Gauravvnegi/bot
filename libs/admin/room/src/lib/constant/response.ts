import { StatusTypes } from '@hospitality-bot/admin/shared';
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
  { label: string; type: StatusTypes }
> = {
  CLEAN: {
    label: 'Clean',
    type: 'active',
  },
  INSPECTED: {
    label: 'Inspected',
    type: 'success',
  },
  OUT_OF_SERVICE: {
    label: 'Out of Service',
    type: 'temp-inactive',
  },
  OUT_OF_ORDER: {
    label: 'Out of Order',
    type: 'inactive',
  },
  UNAVAILABLE: {
    label: 'Unavailable',
    type: 'unavailable',
  },
  VACANT: {
    label: 'Vacant',
    type: 'fulfilled',
  },
  OCCUPIED: {
    label: 'Occupied',
    type: 'inactive',
  },
};
