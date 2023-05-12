import { ValueFormatter } from '../utils/valueFormatter';

export const analytics = {
  chart: {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',
    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
      responsive: true,
      cutoutPercentage: 0,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
  },
  cols: [
    {
      field: 'itemCode',
      header: 'Item & Priority Code / Qty',
      sortType: 'number',
      searchField: ['itemCode', 'priority', 'quantity'],
    },
    {
      field: 'confirmationNumber',
      header: 'Booking No. / Rooms',
      sortType: 'number',
      searchField: ['confirmationNumber', 'rooms[0].roomNumber'],
    },
    {
      field: 'guestDetails.primaryGuest.getFullName()',
      header: 'Guest / company',
      sortType: 'string',
      searchField: ['guestDetails.primaryGuest.getFullName'],
    },
    {
      field: 'guestDetails.primaryGuest.phoneNumber',
      header: 'Phone No./ Email',
      isSortDisabled: true,
      sortType: 'string',
      searchField: [
        'guestDetails.primaryGuest.phoneNumber',
        'guestDetails.primaryGuest.email',
      ],
    },
    {
      field: 'itemName',
      header: 'Item Name / Desc. / Status / Job Duration',
      isSortDisabled: true,
      sortType: 'string',
      searchField: ['itemName', 'remarks', 'action', 'jobDuration'],
    },
    {
      field: 'remarks',
      header: 'Assigned To / Op & Cl - Dt & Tm',
      isSortDisabled: true,
      sortType: 'string',
      isSearchDisabled: true,
    },
    {
      field: '',
      header: 'Actions',
      isSortDisabled: true,
      sortType: '',
      isSearchDisabled: true,
    },
  ],
  tabFilterItems: [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [
        {
          label: 'All',
          icon: '',
          value: 'ALL',
          total: 0,
          isSelected: true,
          type: 'default',
        },
      ],
    },
  ],

  inhouseSentimentChart: {
    chartData: [{ data: [], label: 'No Data', fill: false }],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
      //   legendCallback: this.getLegendCallback,
    },
    chartColors: [
      {
        borderColor: '#fb3d4e',
        backgroundColor: '#fb3d4e',
      },
      {
        borderColor: '#2a8853',
        backgroundColor: '#2a8853',
      },
      {
        borderColor: '#0bb2d4',
        backgroundColor: '#0bb2d4',
      },
      {
        borderColor: '#FF9F67',
        backgroundColor: '#FF9F67',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  },

  legendData: [
    {
      label: 'To Do',
      bubbleColor: '#fb3d4e',
      img: 'assets/svg/test-4.svg',
    },
    {
      label: 'Active',
      bubbleColor: '#4A73FB',
      img: 'assets/svg/test.svg',
    },
    {
      label: 'Closed',
      bubbleColor: '#F25E5E',
      img: 'assets/svg/test-2.svg',
    },
    {
      label: 'Timeout',
      bubbleColor: '#30D8B6',
      img: 'assets/svg/test-3.svg',
    },
  ],

  chartTypes: [
    { name: 'Bar', value: 'bar', url: 'assets/svg/bar-graph.svg' },
    { name: 'Line', value: 'line', url: 'assets/svg/line-graph.svg' },
  ],

  inhouseSourceChart: {
    labels: ['No Data'],
    data: [[100]],
    type: 'doughnut',
    legend: false,
    colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    options: {
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
      responsive: true,
      cutoutPercentage: 75,
    },
  },

  notificationChart: {
    chartData: [
      {
        data: [0, 0, 0],
        label: '',
      },
    ],
    chartLabels: ['Pre-Check-In', 'Post Check-In', 'Post Check-Out'],
    chartOptions: {
      responsive: true,
      cornerRadius: 20,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 10,
        xPadding: 10,
        yPadding: 10,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
            },
          },
        ],
        yAxes: [
          {
            maxBarThickness: 30,
            barPercentage: 0.4,
            display: false,
            gridLines: {
              display: true,
            },
          },
        ],
      },
    },
    chartColors: [
      {
        borderColor: ['#3270eb', '#15eda3', '#ff9867'],
        backgroundColor: ['#3270eb', '#15eda3', '#ff9867'],
      },
    ],
    chartLegend: false,
    chartType: 'horizontalBar',
  },

  preArrivalCols: [
    {
      field: 'itemCode',
      header: 'Item & Priority Code / Qty',
      sortType: 'number',
    },
    {
      field: 'confirmationNumber',
      header: 'Booking No. / Rooms',
      sortType: 'number',
    },
    {
      field: 'guestDetails.primaryGuest.getFullName()',
      header: 'Guest / company',
      sortType: 'string',
    },
    {
      field: 'guestDetails.primaryGuest.phoneNumber',
      header: 'Phone No. / Email',
      isSort: false,
      sortType: 'string',
      searchField: [
        'guestDetails.primaryGuest.phoneNumber',
        'guestDetails.primaryGuest.email',
      ],
    },
    {
      field: 'itemName',
      header: 'Item Name / Desc. / Status / Job Duration',
      sortType: 'string',
      searchField: ['itemName', 'remarks', 'status', 'jobDuration'],
    },
    {
      field: '',
      header: 'Open & Close- Date & Time',
      isSortDisabled: true,
      sortType: 'string',
      isSearchDisabled: true,
    },
    {
      field: '',
      header: 'Actions',
      isSortDisabled: true,
      sortType: '',
      isSearchDisabled: true,
    },
  ],

  PreArrivaltabFilterItems: [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [
        {
          label: 'All',
          icon: '',
          value: 'ALL',
          total: 0,
          isSelected: true,
          type: 'default',
        },
      ],
    },
  ],

  preArrivalChart: {
    chartData: [{ data: [], label: '', fill: false }],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
    chartColors: [],
    chartLegend: false,
    chartType: 'line',
  },

  whatsappChart: {
    chartData: [
      { data: [], label: 'Sent', fill: true },
      { data: [], label: 'Delivered', fill: true },
    ],
    chartLabels: [],
    chartOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 4,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 5,
          hoverBorderWidth: 2,
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              min: 0,
              stepSize: 1,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
    chartColors: [
      {
        borderColor: '#FFBF04',
        backgroundColor: '#FFC10780',
        pointBackgroundColor: '#FFBF04',
        pointBorderColor: '#ffffff',
      },
      {
        borderColor: '#52B33F',
        backgroundColor: '#31BB9280',
        pointBackgroundColor: '#52B33F',
        pointBorderColor: '#ffffff',
      },
    ],
    chartLegend: false,
    chartType: 'line',
  },

  whatsappLegendData: [
    {
      label: 'Sent',
      borderColor: '#0749fc',
      backgroundColor: '#0749fc',
      dashed: true,
      src: 'delivered',
    },
    {
      label: 'Delivered',
      borderColor: '#f2509b',
      backgroundColor: '#f2509b',
      dashed: false,
      src: 'sent',
    },
  ],
  stackedGraph: {
    type: 'bar',
    legend: false,
    labels: [],
    options: {
      responsive: true,
      cornerRadius: 10,
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: function (tooltipItem, data) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || '';
            return `${datasetLabel}: ${ValueFormatter(tooltipItem.yLabel, 2)}`;
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, ticks) {
                return ValueFormatter(value, 2);
              },
            },
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
      },
    },
    datasets: [],
    colors: [
      { backgroundColor: '#4bc0c0' },
      { backgroundColor: '#feac02' },
      { backgroundColor: '#fa586d' },
    ],
  },
  doughnut: {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: true,
        position: 'right',
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
    },
    legend: false,
  },
  lineGraph: {
    datasets: <any>[],
    labels: [],
    options: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 6,
          hitRadius: 5,
          hoverRadius: 8,
          hoverBorderWidth: 2,
          borderWidth: 2,
          borderColor: 'white',
        },
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, ticks) {
                return ValueFormatter(value, 2);
              },
            },
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: function (tooltipItem, data) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || '';
            return `${datasetLabel}: ${ValueFormatter(tooltipItem.yLabel, 2)}`;
          },
        },
      },
    },
    colors: [],
    legend: false,
    type: 'line',
  },
};
