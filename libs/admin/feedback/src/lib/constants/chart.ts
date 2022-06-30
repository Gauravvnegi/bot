export const chartConfig = {
  type: { bar: 'bar', line: 'line', doughnut: 'doughnut' },
  options: {
    distribution: {
      responsive: true,
      cutoutPercentage: 80,
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
    bifurcation: {
      responsive: true,
      cutoutPercentage: 75,
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
    shared: {
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
    globalNPS: {
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
    nps: {
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
              min: -100,
              max: 100,
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
    art: {
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 0,
          borderWidth: 2,
          hitRadius: 5,
          hoverRadius: 0,
          hoverBorderWidth: 2,
        },
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
        filter: function (tooltipItem, data) {
          return !data.datasets[tooltipItem.datasetIndex].tooltipHidden; // custom added prop to dataset
        },
        callbacks: {
          label: function (context) {
            if (context.value !== null) {
              return ' ART: ' + context.value + ' hrs';
            }
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 6,
              callback: function (value, index, ticks) {
                return Math.floor(value) + ' hrs';
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              min: 'Monday',
              max: 'Sunday',
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  },
  colors: {
    distribution: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    shared: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    nps: [
      {
        borderColor: '#0C8054',
        backgroundColor: '#DEFFF3',
        pointBackgroundColor: 'white',
        pointBorderColor: '#0C8054',
        pointHoverBackgroundColor: 'white',
        pointHoverBorderColor: '#0C8054',
      },
    ],
  },
  defaultColor: '#D5D1D1',
};
