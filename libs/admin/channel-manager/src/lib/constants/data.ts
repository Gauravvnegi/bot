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
    label: 'Luxury @1',
    value: 'LUX12373',
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
    label: 'Luxury @2',
    value: 'LUX1243',
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

export const ratesRestriction = [
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
export type RestrictionAndValuesOption = {
  label: string;
  value: string;
  type: 'number' | 'boolean';
};

export const restrictionsRecord: Record<
  typeof ratesRestrictions[number] | typeof inventoryRestrictions[number],
  Omit<RestrictionAndValuesOption, 'value'>
> = {
  rates: {
    label: 'Rates',
    type: 'number',
  },
  availability: {
    label: 'Availability',
    type: 'number',
  },
  stopSell: {
    label: 'Stop Sell',
    type: 'boolean',
  },
  closeOnArrival: {
    label: 'CTA',
    type: 'boolean',
  },
  closeOnDeparture: {
    label: 'CTD',
    type: 'boolean',
  },
  exactStayArrival: {
    label: 'ESA',
    type: 'number',
  },
  minimumStay: {
    label: 'Max Stay',
    type: 'number',
  },
  minimumStayArrival: {
    label: 'MAX STAY ARRIVAL',
    type: 'number',
  },
  maximumAdvanceReservation: {
    label: 'MAX AR',
    type: 'number',
  },
  maximumStay: {
    label: 'Min Stay',
    type: 'number',
  },
  maximumStayArrival: {
    label: 'Min Stay',
    type: 'number',
  },
  minimumAdvanceReservation: {
    label: 'MIN AR',
    type: 'number',
  },
};

export const ratesRestrictions = [
  'rates',
  'stopSell',
  'closeOnArrival',
  'closeOnDeparture',
  'exactStayArrival',
  'minimumStay',
  'minimumStayArrival',
] as const;

export const inventoryRestrictions = [
  'availability',
  'stopSell',
  'closeOnArrival',
  'closeOnDeparture',
  'exactStayArrival',
  'maximumAdvanceReservation',
  'maximumStay',
  'maximumStayArrival',
  'minimumAdvanceReservation',
  'minimumStay',
  'minimumStayArrival',
] as const;

const res = {
  hotelCode: 'SANDBOX-OTA',
  updates: [
    {
      startDate: '2022-11-15',
      endDate: '2022-11-17',

      rates: [
        {
          roomCode: 'EXECUTIVE',
          rate: 1700.0,
          rateplanCode: 'EXECUTIVE-S-101',
          restrictions: {
            closeOnArrival: false,
            closeOnDeparture: false,
            exactStayArrival: null,
            maximumAdvanceReservation: null,
            maximumStay: null,
            maximumStayArrival: null,
            minimumAdvanceReservation: null,
            minimumStay: 1,
            minimumStayArrival: null,
            stopSell: false,
          },
        },
        {
          roomCode: 'EXECUTIVE',
          rate: 1700.0,
          rateplanCode: 'EXECUTIVE-D-101',
          restrictions: {
            closeOnArrival: false,
            closeOnDeparture: false,
            exactStayArrival: null,
            maximumAdvanceReservation: null,
            maximumStay: null,
            maximumStayArrival: null,
            minimumAdvanceReservation: null,
            minimumStay: 1,
            minimumStayArrival: null,
            stopSell: false,
          },
        },

        {
          roomCode: 'SUITE',
          rate: 2700.0,
          rateplanCode: 'SUITE-S-101',
        },
        {
          roomCode: 'SUITE',
          rate: 2700.0,
          rateplanCode: 'SUITE-D-101',
        },
      ],
    },
  ],
};

const response = {
  hotelCode: 'SANDBOX-OTA',
  updates: [
    {
      startDate: '2022-11-15',
      endDate: '2022-11-17',
      rooms: [
        {
          available: 2,
          roomCode: 'SUITE',
          restrictions: {
            closeOnArrival: false,
            closeOnDeparture: false,
            exactStayArrival: null,
            minimumStay: 1,
            minimumStayArrival: null,
            stopSell: false,
          },
        },
        {
          available: 10,
          roomCode: 'EXECUTIVE',
          restrictions: {
            closeOnArrival: false,
            closeOnDeparture: false,
            exactStayArrival: null,
            minimumStay: 1,
            minimumStayArrival: null,
            stopSell: false,
          },
        },
      ],
    },
  ],
};
