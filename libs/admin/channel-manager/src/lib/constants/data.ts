export const channels = [
  {
    label: 'Agoda',
    value: 'AGODA',
  },
  {
    label: 'Booking.com',
    value: 'BOOKINGDOTCOM',
  },
];

export const roomTypeData = [
  {
    label: 'Luxury',
    value: 'LUX123',
    ratePlans: [
      {
        type: 'EP',
        label: 'Room Only',
        value: 'LUX0EP123RO',
        isChannelVisible: false,
        channels: channels,
      },
      {
        type: 'CP',
        label: 'With breakfast',
        value: 'LUX0CP123WB',
        isChannelVisible: false,
        channels: channels,
      },
    ],
  },
  {
    label: 'Deluxe',
    value: 'DEL123',
    ratePlans: [
      {
        type: 'EP',
        label: 'Room Only',
        value: 'DEL0EP123RO',
        isChannelVisible: false,
        channels: channels,
      },
      {
        type: 'CP',
        label: 'With breakfast',
        value: 'DEL0CP123WB',
        isChannelVisible: false,
        channels: channels,
      },
    ],
  },
];

const ratesRestriction = [
  { label: 'Stop Cell', value: 'asd' },
  { label: 'CTA', value: 'CTA' },
  { label: 'CTD', value: 'CTD' },
  { label: 'Min Stay', value: 'Min Stay' },
  { label: 'Max Stay', value: 'Max Stay' },
];

export const inventoryTreeList = [
  {
    id: '1',
    name: 'Category 1',
    isSelected: true,
    channels: [
      {
        id: '11',
        name: 'Channel 1',
        isSelected: true,
      },
      {
        id: '12',
        name: 'Channel 2',
        isSelected: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Category 2',
    isSelected: false,
    channels: [
      {
        id: '21',
        name: 'Channel 3',
        isSelected: true,
      },
      {
        id: '22',
        name: 'Channel 4',
        isSelected: false,
      },
    ],
  },
  // Add more items as needed
];
