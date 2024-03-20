import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { deepCopy } from '../../utils/shared';

interface DoughnutChartData {
  Labels: string[];
  Data: number[][];
  Type: string;
  Legend: boolean;
  Colors: {
    backgroundColor: string[];
    borderColor: string[];
  }[];
  Options: {
    tooltips: {
      backgroundColor: string;
      bodyFontColor: string;
      borderColor: string;
      borderWidth: number;
      titleFontColor: string;
      titleMarginBottom: number;
      xPadding: number;
      yPadding: number;
      callbacks: Record<string, any>; // You can specify more specific callback types if known
    };
    responsive: boolean;
    cutoutPercentage: number;
  };
}

const DefaultDoughnutConfig = {
  tooltips: {
    backgroundColor: 'white',
    bodyFontColor: 'black',
    borderColor: '#f4f5f6',
    borderWidth: 3,
    titleFontColor: 'black',
    titleMarginBottom: 5,
    xPadding: 10,
    yPadding: 10,
    callbacks: {},
  },
  responsive: true,
  cutoutPercentage: 40,
};

const doughnutTransparentGraphDefaultConfig = {
  Labels: ['NO DATA'],
  Data: [],
  Type: 'doughnut',
  Legend: false,
  Colors: [
    {
      backgroundColor: ['transparent'],
      borderColor: ['transparent'],
    },
  ],
  Options: DefaultDoughnutConfig,
};

const doughnutGraphDefaultConfig = {
  Labels: ['NO DATA'],
  Data: [],
  Type: 'doughnut',
  Legend: false,
  Colors: [
    {
      backgroundColor: ['#e61042'],
      borderColor: ['#e61042'],
    },
  ],
  Options: DefaultDoughnutConfig,
};
@Component({
  selector: 'hospitality-bot-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss'],
})
export class DoughnutComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  doughnutGraphData: DoughnutChartData = doughnutGraphDefaultConfig;
  doughnutTransparentGraphData: DoughnutChartData = doughnutTransparentGraphDefaultConfig;

  @Input() label: string = 'Doughnut';
  @Input() loading: boolean = false;
  @Input() selectedColor: string = '#e61042';

  selectedIndex: number = 0;
  backUpData: DoughnutChartData;

  @Input() set config(data: DoughnutChartData) {
    if (data) {
      this.backUpData = data;
      this.initGraphData(data);
      this.initTransparentGraph(0);
    }
  }
  total: number = 0;

  initGraphData(data: DoughnutChartData) {
    Object.assign(this.doughnutGraphData, deepCopy(data));
    Object.assign(this.doughnutTransparentGraphData, deepCopy(data));
  }

  initTransparentGraph(index: number) {
    const transparentColor = 'transparent';
    const colors = this.doughnutTransparentGraphData.Colors[0];

    colors.backgroundColor = colors.backgroundColor.map((item, idx) =>
      idx === index ? this.selectedColor : transparentColor
    );

    colors.borderColor = colors.borderColor.map((item, idx) =>
      idx === index ? this.selectedColor : transparentColor
    );

    this.doughnutGraphData.Colors[0].backgroundColor[
      index
    ] = this.selectedColor;
    this.doughnutGraphData.Colors[0].borderColor[index] = this.selectedColor;
  }

  constructor() {}

  ngOnInit(): void {}

  resetData() {
    this.doughnutGraphData = doughnutGraphDefaultConfig;
    this.doughnutTransparentGraphData = doughnutTransparentGraphDefaultConfig;
  }

  handleCircularGraphClick(data: any) {
    if (data.event.type === 'click') {
      const clickedIndex = data.active[0]?._index;
      this.resetData();
      this.initGraphData(this.backUpData);
      this.initTransparentGraph(clickedIndex);
    }
  }
}

// const doughnutGraphData = {
//   Labels: [
//     'Maintenance',
//     'Wifi Services',
//     'Reservations',
//     'Front Office',
//     'Food & Beverage',
//     'House Keeping',
//   ],
//   Data: [[2, 2, 2, 2, 2, 2]],
//   Type: 'doughnut',
//   Legend: false,
//   Colors: [
//     {
//       backgroundColor: [
//         '#e61042',
//         '#b2b7bc',
//         '#99a6b5',
//         '#909090',
//         '#7e7e7e',
//         '#696969',
//       ],
//       borderColor: [
//         '#e61042',
//         'transparent',
//         'transparent',
//         'transparent',
//         'transparent',
//         'transparent',
//       ],
//     },
//   ],
//   Options: DefaultDoughnutConfig,
// };

// const doughnutTransparentGraphData = {
//   Labels: [
//     'Maintenance',
//     'Wifi Services',
//     'Reservations',
//     'Front Office',
//     'Food & Beverage',
//     'House Keeping',
//   ],
//   Data: [[2, 2, 2, 2, 2, 2]],
//   Type: 'doughnut',
//   Legend: false,
//   Colors: [
//     {
//       backgroundColor: [
//         '#e61042',
//         'transparent',
//         'transparent',
//         'transparent',
//         'transparent',
//         'transparent',
//       ],
//       borderColor: [
//         '#e61042',
//         'transparent',
//         'transparent',
//         'transparent',
//         'transparent',
//       ],
//     },
//   ],
//   Options: DefaultDoughnutConfig,
// };
