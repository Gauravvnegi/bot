import { DynamicPricingResponse } from '../types/dynamic-pricing.types';

export const dayTimeResponse = {
  configDetails: [
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
              id: 'a6d3a984-32f0-427d-adbe-9ec6f36a64a5',
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
              id: 'a6d5a984-32f0-427d-adbe-9ec6f36a64a5',
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
              id: 'a6d5a984-32f0-427d-adbe-9ec6f36a64a5',
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
              id: 'a6d5a984-32f0-427d-adbe-9ec6f36a64a5',
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
      id: 'abd9b5a2-b77b-4247-b323-53fad7c5d96f',
      entityId: 'f4baead1-06c6-42e8-821b-aef4a99ef5bb',
      name: 'SUMMER 4',
      fromDate: 1701369000000,
      toDate: 1703961000000,
      daysIncluded: ['SATURDAY', 'SUNDAY'],
      status: 'ACTIVE',
      type: 'OCCUPANCY',
      configItems: [
        {
          type: 'ROOM_TYPE',
          id: '69b42990-aad6-4566-a2c8-0b89172e96d7',
          configRules: [
            {
              id: '365c2935-1027-485b-a2f8-2f0101c23efc',
              occupancyStart: 0.0,
              occupancyEnd: 3.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: 'de456ae8-74f8-4797-a969-095689f78451',
              occupancyStart: 3.0,
              occupancyEnd: 6.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -5.0,
              },
              status: 'ACTIVE',
            },
          ],
        },
        {
          type: 'ROOM_TYPE',
          id: '80f933ba-ac3e-479e-abc7-eb73116cabba',
          configRules: [
            {
              id: '2a9544e1-5187-42f1-864f-434e6b023dab',
              occupancyStart: 0.0,
              occupancyEnd: 4.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: 'bbe97d3f-4057-4c11-adae-f919f747deb3',
              occupancyStart: 5.0,
              occupancyEnd: 8.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -5.0,
              },
              status: 'ACTIVE',
            },
          ],
        },
      ],
    },
  ],
} as DynamicPricingResponse;
