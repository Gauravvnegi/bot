import { Cols } from '@hospitality-bot/admin/shared';

export const cols: Record<string, Cols[]> = {
  rooms: [
    {
      field: 'occupiedRooms',
      header: 'Occupied Rooms',
    },
    {
      field: 'availableRooms',
      header: 'Available Rooms',
    },
    {
      field: 'checkIns',
      header: 'Check-In',
    },
    {
      field: 'checkOuts',
      header: 'Check-outs',
    },
    {
      field: 'noShows',
      header: 'No Shows',
    },
    {
      field: 'cancellations',
      header: 'Cancellations',
    },
  ],

  houseKeeping: [
    {
      field: 'clean',
      header: 'CLEAN',
    },
    {
      field: 'dirty',
      header: 'DIRTY',
    },
    {
      field: 'inspected',
      header: 'INSPECTED',
    },
  ],

  accountDetails: [
    {
      field: 'counter',
      header: 'Cashier',
    },
    {
      field: 'revenueReceived',
      header: 'Revenue Received',
    },
    {
      field: 'withdrawals',
      header: 'Withdrawals',
    },
    {
      field: 'balance',
      header: 'Balance',
    },
  ],

  revenueList: [
    {
      field: 'booking',
      header: 'Booking',
    },
    {
      field: 'cancellation',
      header: 'Cancellation',
    },
    {
      field: 'noShows',
      header: 'No Show',
    },
    {
      field: 'restaurant',
      header: 'Restaurant',
    },
  ],
};

export const dummyData = {
  rooms: {
    title: 'Room Details',
    values: [
      {
        occupiedRooms: 25,
        availableRooms: 75,
        checkIns: 10,
        checkOuts: 5,
        noShows: 2,
        cancellations: 3,
      },
      {
        occupiedRooms: 30,
        availableRooms: 70,
        checkIns: 15,
        checkOuts: 8,
        noShows: 1,
        cancellations: 4,
      },
    ],
  },
  houseKeeping: {
    title: 'Housekeeping Details',
    values: [
      {
        checkoutRooms: 5,
        vacantRooms: 10,
        occupiedOut: 8,
      },
      {
        checkoutRooms: 3,
        vacantRooms: 7,
        occupiedOut: 6,
      },
    ],
  },
  accountDetails: {
    title: 'Account Details',
    values: [
      {
        counter: 102,
        revenueReceived: 5000,
        withdrawals: 2000,
        balance: 3000,
      },
      {
        counter: 105,
        revenueReceived: 6000,
        withdrawals: 2500,
        balance: 3500,
      },
      {
        counter: 'Total',
        revenueReceived: 'Rs 6000',
        withdrawals: 'Rs 6000',
        balance: 'Rs 6000',
      },
    ],
  },
  revenueList: {
    title: 'Revenue List',
    values: [
      {
        booking: 5000,
        cancellation: 1000,
        noShows: 200,
        restaurant: 3000,
        miniBar: 1200,
        confectionary: 800,
        bookStore: 400,
        iceCreamStore: 600,
      },
      {
        booking: 5500,
        cancellation: 1200,
        noShows: 150,
        restaurant: 3200,
        miniBar: 1300,
        confectionary: 850,
        bookStore: 420,
        iceCreamStore: 580,
      },
      {
        booking: 'Total Revenue',
        cancellation: '',
        noShows: '',
        restaurant: '',
        miniBar: '',
        confectionary: '',
        bookStore: '',
        iceCreamStore: 'Rs. 2494',
      },
    ],
  },
};
