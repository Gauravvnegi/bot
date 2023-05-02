export const chartConfig = {
  doughnutChart: {
      type: 'doughnut',
      data: {
        labels: ['No Data'],
        datasets: [
          {
            data: [[]],
            backgroundColor: ['#FF6283', '#FFCD56'],
          },
        ],
      },
      colors: [
        {
          backgroundColor: ['#FF6283', '#FFCD56'],
        },
      ],
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'right',
        },
      },
  },

  averageRoomStat: {
      data: {
        labels: [''],
        datasets: [
          {
            label: 'Average Room Rate',
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

  occupancyStat: {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Occupancy',
          fill: true,
          data: [],
        },
      ],
    },
    colors: [
      {
        backgroundColor: '#AAE8D1',
        borderColor: '#5FD1A7',
      }
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
