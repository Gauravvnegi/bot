export const chartConfig = {
  types: {
    bar: 'bar',
    line: 'line',
    doughnut: 'doughnut',
  },
  bookingStatus: {
    defaultData: [
      { data: [], label: 'Check-In', fill: false },
      { data: [], label: 'Checkout', fill: false },
    ],
    barColors: [
      {
        backgroundColor: '#288ad6',
      },
      {
        backgroundColor: '#F2509B',
      },
    ],
  },
  customer: {
    colors: {
      checkIn: '#0ea47a',
      expressCheckIn: '#15eda3',
      checkout: '#FF4545',
      expressCheckout: '#FF9867',
    },
  },
  chartTypes: [
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
  ],
  default: {
    data: ['No Data'],
    label: [100],
    colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
  },
  defaultColor: '#D5D1D1',
};
