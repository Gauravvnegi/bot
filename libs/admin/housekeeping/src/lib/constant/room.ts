import { FlagType } from '@hospitality-bot/admin/shared';
import {
  RoomFoStatus,
  RoomStatus,
} from 'libs/admin/room/src/lib/types/service-response';

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

export const infoConfig = [
  {
    title: 'Room Status',
    color: '',
    subOptions: [
      {
        name: 'Occupied',
        color: '#ef1d45',
      },
      {
        name: 'Vacant',
        color: '#52b33f',
      },
      {
        name: 'Clean',
        color: '#52b33f',
      },
      {
        name: 'Due Out',
        color: '#500',
      },
      {
        name: 'Dirty',
        color: '#ff8f00',
      },
    ],
  },
];
