export const dashboardConfig = {
  subscriber: {
    legendData: [
      {
        label: 'Subscribers',
        borderColor: '#0749fc',
        backgroundColor: '#0749fc',
        dashed: true,
        src: 'assets/svg/delivered.svg',
      },
      {
        label: 'Unsubscribers',
        borderColor: '#f2509b',
        backgroundColor: '#f2509b',
        dashed: false,
        src: 'assets/svg/sent.svg',
      },
    ],
  },

  rateGraph: {
    legendData: [
      {
        label: 'Open Rate',
        borderColor: '#0749fc',
        backgroundColor: '#0749fc',
        dashed: true,
        src: 'assets/svg/delivered.svg',
      },
      {
        label: 'Click Rate',
        borderColor: '#f2509b',
        backgroundColor: '#f2509b',
        dashed: false,
        src: 'assets/svg/sent.svg',
      },
    ],
  },

  chart: {
    chartData: [],
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
              stepSize: 20,
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
};
