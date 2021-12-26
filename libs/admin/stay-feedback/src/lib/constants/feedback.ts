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
  colorConfig: {
    distribution: {
      VERYPOOR: '#CC052B',
      POOR: '#EF1D45',
      ADEQUATE: '#FF8F00',
      GOOD: '#4BA0F5',
      VERYGOOD: '#224BD5',
      OUTSTANDING: '#508919',
    },
    globalNPS: {
      neutral: '#4BA0F5',
      positive: '#1AB99F',
      negative: '#EF1D45',
    },
  },
  labels: {
    globalNPS: {
      neutral: 'Neutral',
      positive: 'Positive',
      negative: 'Negative',
    },
  },
  tabFilterItems: {
    topLowNPS: [
      {
        label: 'Department',
        icon: '',
        value: 'DEPARTMENT',
        total: 0,
        isSelected: true,
      },
      {
        label: 'Service',
        icon: '',
        value: 'SERVICE',
        total: 0,
        isSelected: false,
      },
      {
        label: 'Touchpoint',
        icon: '',
        value: 'TOUCHPOINT',
        total: 0,
        isSelected: false,
      },
    ],
  },
  canvas: {
    department: {
      lineWidth: 15,
      x: 62,
      y: 62,
      radius: 55,
    },
  },
  defaultColor: '#f2f2f2',
  negativeColor: '#EF1D45',
  neutralColor: '#4BA0F5',
  positiveColor: '#1AB99F',
  percentValues: [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -100],
  minPercent: -100,
  maxPercent: 100,
};
