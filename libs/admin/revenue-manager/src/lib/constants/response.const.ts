export const OccupancyResponse = {
  configDetails: [
    {
      id: 'bde34992-44fc-4565-8ddd-59e44df57ba1',
      entityId: '5ef958ce-39a7-421c-80e8-ee9973e27b99',
      name: 'Rainy Season',
      fromDate: 1694284200000,
      toDate: 1694716200000,
      daysIncluded: ['SUNDAY'],
      status: 'ACTIVE',
      type: 'OCCUPANCY',
      configItems: [
        {
          type: 'HOTEL',
          id: '5ef958ce-39a7-421c-80e8-ee9973e27b99',
          configRules: [
            {
              id: '4b33e0a6-868a-41b4-a2da-2481ac905091',
              occupancyStart: 0.0,
              occupancyEnd: 3.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: '25471ac2-2a18-410f-a05a-4da172d0bb2d',
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
      ],
    },
    {
      id: '6f051700-d1fd-45e6-b525-9bd20e27fdda',
      entityId: 'f4baead1-06c6-42e8-821b-aef4a99ef5bb',
      name: 'SUMMER 2',
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
              id: 'e664492d-1371-485a-b640-ba0d2b751875',
              occupancyStart: 0.0,
              occupancyEnd: 5.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: '44f24f11-97d7-41ec-bf1f-e8b31e53a222',
              occupancyStart: 6.0,
              occupancyEnd: 10.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -5.0,
              },
              status: 'ACTIVE',
            },
            {
              id: '44454f11-97d7-41ec-bf1f-e8b31e53a222',
              occupancyStart: 5.0,
              occupancyEnd: 56.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -8.0,
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
              id: 'e55cb026-f956-46f1-b3e8-f639efa8b681',
              occupancyStart: 0.0,
              occupancyEnd: 5.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: 'bb9e8eef-9959-4d10-858d-b18739110896',
              occupancyStart: 6.0,
              occupancyEnd: 10.0,
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
    {
      id: '777f5b6f-d337-4253-92c9-7a34cb04aba5',
      entityId: 'f4baead1-06c6-42e8-821b-aef4a99ef5bb',
      name: 'SUMMER 3',
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
              id: '652ebbb8-9168-4d08-8392-218b76230a17',
              occupancyStart: 0.0,
              occupancyEnd: 3.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: '3fd380b4-5c29-4fbd-8ffd-5f8ed942d804',
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
              id: '052fde09-0463-48f1-979d-f29a3e62c486',
              occupancyStart: 0.0,
              occupancyEnd: 4.0,
              discountOrMarkup: {
                type: 'PERCENTAGE',
                value: -10.0,
              },
              status: 'ACTIVE',
            },
            {
              id: 'e2b7d37c-d496-4d2d-bc9e-09371cc5cf41',
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
};
