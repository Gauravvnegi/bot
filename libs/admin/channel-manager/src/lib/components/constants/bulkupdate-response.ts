import { Option } from '@hospitality-bot/admin/shared';
import { RoomTypes } from '../../types/bulk-update.types';

export const RoomsData: RoomTypes[] = [
  {
    name: 'luxury1',
    id: 'luxury1',
    isSelected: false,
    variants: [
      {
        name: 'variant1',
        id: 'variant1',
        isSelected: false,
        channels: [
          {
            id: 'channel1',
            name: 'channel1',
            isSelected: false,
          },
          {
            id: 'channel2',
            name: 'channel2',
            isSelected: false,
          },
        ],
      },
      {
        name: 'variant2',
        id: 'variant2',
        isSelected: false,
        channels: [
          {
            id: 'channel1',
            name: 'channel1',
            isSelected: false,
          },
          {
            id: 'channel2',
            name: 'channel2',
            isSelected: false,
          },
        ],
      },
    ],
  },
  {
    name: 'luxury2',
    id: 'luxury2',
    isSelected: false,
    variants: [
      {
        name: 'variant1',
        id: 'variant1',
        isSelected: false,
        channels: [
          {
            id: 'channel1',
            name: 'channel1',
            isSelected: false,
          },
          {
            id: 'channel2',
            name: 'channel2',
            isSelected: false,
          },
        ],
      },
      {
        name: 'variant2',
        id: 'variant2',
        isSelected: false,
        channels: [
          {
            id: 'channel1',
            name: 'channel1',
            isSelected: false,
          },
          {
            id: 'channel2',
            name: 'channel2',
            isSelected: false,
          },
        ],
      },
    ],
  },
];

export const updateItems: Option[] = [
  { label: 'Availability', value: 'AVAILABILITY' },
  { label: 'Rates', value: 'RATE' },
];
export const roomTypes: Option[] = [
  { label: 'Room Type1', value: 'room1' },
  { label: 'Room Type2', value: 'room2' },
];

export const weeks: Option[] = [
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
  { label: 'Sat', value: 'Saturday' },
  { label: 'Sun', value: 'Sunday' },
];
