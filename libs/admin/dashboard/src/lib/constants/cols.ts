export const cols = {
  reservation: [
    {
      field: 'rooms.roomNumber',
      header: 'Room No / Type',
      sortType: 'number',
      searchField: ['rooms.roomNumber', 'rooms.type'],
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No.',
      sortType: 'number',
      searchField: ['booking.bookingNumber', 'feedback.comments'],
    },
    {
      field: `guests.primaryGuest.fullName`,
      header: 'Guest / Company',
      sortType: 'string',
      searchField: [
        'guests.primaryGuest.fullName',
        'guests.secondaryGuest.fullName',
      ],
    },
    {
      field: `guests.primaryGuest.getPhoneNumber()`,
      header: 'Phone No.',
      sortType: 'string',
    },
    {
      field: 'booking.getArrivalTimeStamp()',
      header: 'Arrival / Departure',
      sortType: 'date',
      isSearchDisabled: true,
    },
    {
      field: 'payment.totalAmount',
      header: 'Amount Due / Total(INR)',
      sortType: 'number',
      isSearchDisabled: true,
    },
    // {
    //   field: 'package',
    //   header: 'Add-ons',
    //   isSortDisabled: true,
    //   sortType: 'number',
    //   isSearchDisabled: true,
    // },
    {
      field: 'stageAndourney',
      header: 'Stage/Journey',
      isSortDisabled: true,
      sortType: 'number',
      isSearchDisabled: true,
    },
  ],
};

export const tableTypes = {
  table: {
    name: 'table',
    value: 'table',
    url: 'assets/svg/reservation-table.svg',
    whiteUrl: 'assets/svg/reservation-table-white.svg',
    backgroundColor: '#1AB99F',
  },
  calendar: {
    name: 'calendar',
    value: 'calendar',
    url: 'assets/svg/calendar-dark.svg',
    whiteUrl: 'assets/svg/calendar-white.svg',
    backgroundColor: '#DEFFF3',
  },
};
