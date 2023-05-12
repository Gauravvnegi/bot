export const cols = {
  reservation: [
    {
      field: 'rooms.roomNumber',
      header: 'Rooms',
      sortType: 'number',
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No. / Feedback',
      sortType: 'number',
      searchField: ['booking.bookingNumber', 'feedback.comments'],
    },
    {
      field: `guests.primaryGuest.fullName`,
      header: 'Guest / Company',
      sortType: 'string',
      searchField: ['guests.primaryGuest.fullName' ,'guests.secondaryGuest.fullName'],
    },
    {
      field: `guests.primaryGuest.phoneNumber`,
      header: 'Phone No.',
      sortType: 'number',
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
    {
      field: 'package',
      header: 'Package',
      isSortDisabled: true,
      sortType: 'number',
      isSearchDisabled: true,
    },
    {
      field: 'stageAndourney',
      header: 'Stage/Journey',
      isSortDisabled: true,
      sortType: 'number',
      isSearchDisabled: true,
    },
  ],
};
