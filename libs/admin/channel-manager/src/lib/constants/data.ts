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
        channels: channels,
      },
      {
        type: 'CP',
        label: 'With breakfast',
        value: 'LUX0CP123WB',
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
        channels: channels,
      },
      {
        type: 'CP',
        label: 'With breakfast',
        value: 'DEL0CP123WB',
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
