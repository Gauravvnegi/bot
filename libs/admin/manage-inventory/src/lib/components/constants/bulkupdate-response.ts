import { Option } from '@hospitality-bot/admin/shared';
import { RoomTypes } from '../../types/bulk-update.types';
const channels = [
  {
    name: 'Agoda',
    id: 'channel1',
    isSelected: false,
  },
  {
    id: 'channel2',
    name: 'Booking.com',
    isSelected: false,
  },
];

export const RoomsData: RoomTypes[] = [
  {
    name: 'Luxury',
    id: 'LUXURY-ID',
    isSelected: false,
    channels: channels,
    variants: [
      {
        name: 'EP (Room Only)',
        id: 'variant1',
        isSelected: false,
        channels: channels,
      },
      {
        name: 'CP (With breakfast)',
        id: 'variant2',
        isSelected: false,
        channels: channels,
      },
    ],
  },
  {
    name: 'Delux',
    id: 'DELUX-ID',
    isSelected: false,

    channels: channels,
    variants: [
      {
        name: 'EP (Room Only)',
        id: 'variant1',
        isSelected: false,
        channels: channels,
      },
      {
        name: 'CP (With breakfast)',
        id: 'variant2',
        isSelected: false,
        channels: [
          {
            id: 'channel2',
            name: 'Booking.com',
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
