export const chartConfig = {
  barChart: {
    data: {
      labels: [''],
      datasets: [
        {
          borderWidth: 0,
          barThickness: 6,
          data: [],
          backgroundColor: '#8064FA',
          borderColor: 'rgba(54, 162, 235, 1)',
          hoverBorderColor: 'red',
        },
      ],
    },
    options: {
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
              stepSize: 200,
            },
          },
        ],
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  },

  lineChart: {
    type: 'line',
    data: {
      datasets: [
        {
          fill: true,
          data: [],
        },
      ],
    },
    colors: [
      {
        backgroundColor: '#AAE8D1',
        borderColor: '#5FD1A7',
      },
    ],
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            gridlines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridlines: {
              display: true,
            },
            ticks: {
              stepSize: 2,
            },
          },
        ],
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  },
};
