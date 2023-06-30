import { FlagType } from '@hospitality-bot/admin/shared';
import { RoomFoStatus, RoomStatus } from '../types/service-response';
import { RatePlanOptions } from '../types/room';

export const roomStatuses: RoomStatus[] = [
  'CLEAN',
  'INSPECTED',
  'OUT_OF_ORDER',
  'OUT_OF_SERVICE',
  'UNAVAILABLE',
  'DIRTY'
];

export const roomStatusDetails: Record<
  RoomStatus | RoomFoStatus | 'DIRTY',
  { label: string; type: FlagType }
> = {
  CLEAN: {
    label: 'Clean',
    type: 'active',
  },
  DIRTY: {
    label: 'Dirty',
    type: 'warning',
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
    type: 'warning'
  }
};

export const ratePlanResponse: RatePlanOptions[] = [
  {
    label: 'EP (Room Only)',
    value: 'EP (Room Only)',
  },
  {
    label: 'CP (With BF)',
    value: 'CP (With BF)',
  },
  {
    label: 'MAP (With BF and 1 Major Meal)',
    value: 'MAP (With BF and 1 Major Meal)',
  },
  {
    label: 'AP (With all 3 Meals)',
    value: 'AP (With all 3 Meals)',
  },
];
