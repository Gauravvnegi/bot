export const feedback = {
  cols: {
    feedbackDatatable: [
      {
        field: 'getFullName()',
        header: 'Guest/ Company',
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
        field: 'booking.bookingNumber',
        header: 'Booking No./ Feedback',
        isSort: true,
        sortType: 'number',
      },
      {
        field: `getPhoneNumber()`,
        header: 'Phone No.',
        isSort: false,
        sortType: 'string',
      },
      {
        field: 'payment.totalAmount',
        header: 'Amount Due/ Total Spend',
        isSort: true,
        sortType: 'number',
      },
      {
        field: 'guestAttributes.transactionUsage',
        header: 'Transaction Usage',
        isSort: true,
        sortType: 'string',
      },
      {
        field: 'guestAttributes.overAllNps',
        header: 'Overall NPS',
        isSort: true,
        sortType: 'number',
      },
      {
        field: 'guestAttributes.churnProbalilty',
        header: 'Churn Prob/ Prediction',
        isSort: true,
        sortType: 'number',
      },
      { field: 'stageAndourney', header: 'Stage/ Channels' },
    ],
  },
  chips: {
    feedbackDatatable: [
      { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
      {
        label: 'VIP',
        icon: '',
        value: 'VIP',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'High Potential ',
        icon: '',
        value: 'HIGHPOTENTIAL',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
      {
        label: 'High Risk ',
        icon: '',
        value: 'HIGHRISK',
        total: 0,
        isSelected: false,
        type: 'initiated',
      },
    ],
  },
  chartType: {
    bar: {
      name: 'Bar',
      value: 'bar',
      url: 'assets/svg/bar-graph.svg',
      backgroundColor: '#1AB99F',
    },
    line: {
      name: 'Line',
      value: 'line',
      url: 'assets/svg/line-graph.svg',
      backgroundColor: '#DEFFF3',
    },
  },
};
