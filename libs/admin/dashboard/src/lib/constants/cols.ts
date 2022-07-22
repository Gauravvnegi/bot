export const cols = {
  reservation: [
    {
      field: 'rooms.roomNumber',
      header: 'Rooms',
      isSort: true,
      sortType: 'number',
    },
    {
      field: 'booking.bookingNumber',
      header: 'Booking No./Feedback',
      isSort: true,
      sortType: 'number',
    },
    {
      field: `guests.primaryGuest.fullName`,
      header: 'Guest/company',
      isSort: true,
      sortType: 'string',
    },
    {
      field: `guests.primaryGuest.getPhoneNumber()`,
      header: 'Phone No.',
      isSort: true,
      sortType: 'string',
    },
    {
      field: 'booking.getArrivalTimeStamp()',
      header: 'Arrival/ Departure',
      isSort: true,
      sortType: 'date',
    },
    {
      field: 'payment.totalAmount',
      header: 'Amount Due/Total(INR)',
      isSort: true,
      sortType: 'number',
    },
    {
      field: 'package',
      header: 'Package',
      isSort: false,
      sortType: 'number',
    },
    {
      field: 'stageAndourney',
      header: 'Stage/Journey',
      isSort: false,
      sortType: 'number',
    },
  ],
};
