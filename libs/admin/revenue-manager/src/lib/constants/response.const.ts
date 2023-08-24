export const dayTimeResponse = [
  {
    name: 'Day Trigger 1',
    fromDate: 1694284200000,
    toDate: 1694716200000,
    daysIncluded: ['MONDAY'],
    status: 'ACTIVE',
    configItems: [
      {
        type: 'HOTEL',
        id: 'a6d3a984-32f0-427d-adbe-9ec6f36a64a5',
        configRules: [
          {
            occupancyStart: 0,
            occupancyEnd: 3,
            discountOrMarkup: {
              type: 'PERCENTAGE',
              value: -10,
            },
            status: 'ACTIVE',
            fromTimeInMillis: 3600000,
            toTimeInMillis: 18000000,
          },
          {
            occupancyStart: 3,
            occupancyEnd: 6,
            discountOrMarkup: {
              type: 'PERCENTAGE',
              value: -5,
            },
            status: 'ACTIVE',
            fromTimeInMillis: 21600000,
            toTimeInMillis: 28800000,
          },
        ],
      },
    ],
  },
  {
    name: 'Day Trigger 2',
    fromDate: 1694284200000,
    toDate: 1694716200000,
    daysIncluded: ['MONDAY'],
    status: 'ACTIVE',
    configItems: [
      {
        type: 'HOTEL',
        id: 'a6d3a984-32f0-427d-adbe-9ec6f36a64a5',
        configRules: [
          {
            occupancyStart: 0,
            occupancyEnd: 3,
            discountOrMarkup: {
              type: 'PERCENTAGE',
              value: -10,
            },
            status: 'ACTIVE',
            fromTimeInMillis: 3600000,
            toTimeInMillis: 18000000,
          },
          {
            occupancyStart: 3,
            occupancyEnd: 6,
            discountOrMarkup: {
              type: 'PERCENTAGE',
              value: -5,
            },
            status: 'ACTIVE',
            fromTimeInMillis: 21600000,
            toTimeInMillis: 28800000,
          },
        ],
      },
    ],
  },
];
