import { analytics } from '@hospitality-bot/admin/shared';
import { ValueFormatter } from 'libs/admin/shared/src/lib/utils/valueFormatter';

export const SentimentalChart = {
  stackedGraph: { ...analytics.stackedGraph },
  doughnutChart: {
    ...analytics.doughnut,
    options: {
      ...analytics.doughnut.options,
      tooltips: {
        ...analytics.doughnut.options.tooltips,
        callbacks: {
          label: function (tooltipItem, data) {
            return `${data.labels[tooltipItem.index]}: ${
              data.datasets[0].data[tooltipItem.index]
            }%`;
          },
        },
      },
    },
    data: {
      labels: ['Negative', 'Neutral', 'Positive'],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    },
  },
  sentimentOverTime: {
    ...analytics.lineGraph,
    datasets: [
      { data: [], label: 'Positive', fill: true },
      { data: [], label: 'Neutral', fill: true },
      { data: [], label: 'Negative', fill: true },
    ],
    options: {
      ...analytics.lineGraph.options,
      tooltips: {
        ...analytics.lineGraph.options.tooltips,
        callbacks: {
          label: function (tooltipItem, data) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || '';
            return `${datasetLabel}: ${tooltipItem.yLabel}%`;
          },
        },
      },
      scales: {
        ...analytics.lineGraph.options.scales,
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 25,
              steps: 5,
              callback: function (value, index, ticks) {
                return `${value}%`;
              },
            },
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
      },
    },
  },
  topicsBarGraph: {
    type: 'horizontalBar',
    labels: [],
    datasets: [{ data: [], label: '' }],
    colors: [{ backgroundColor: [] }],
    legend: false,
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
      },
      scales: {
        yAxes: [
          {
            gridLines: { drawOnChartArea: false },
          },
        ],
        xAxes: [
          {
            gridLines: { drawOnChartArea: false },
            ticks: { beginAtZero: true },
          },
        ],
      },
    },
  },
  topicsOverTime: {
    ...analytics.stackedGraph,
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
      plotOptions: { series: { borderRadius: 10 } },
    },
    colors: [],
  },
};
