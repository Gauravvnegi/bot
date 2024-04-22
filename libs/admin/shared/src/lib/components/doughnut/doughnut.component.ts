import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { deepCopy } from '../../utils/shared';

interface DoughnutChartData {
  total?: number;
  Labels: string[];
  Data: number[];
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
  Labels: ['No Data'],
  Data: [100],
  Type: 'doughnut',
  Legend: false,
  Colors: [
    {
      backgroundColor: ['#D5D1D1'],
      borderColor: ['#D5D1D1'],
    },
  ],
  Options: DefaultDoughnutConfig,
};

const doughnutGraphDefaultConfig = {
  Labels: ['No Data'],
  Data: [100],
  Type: 'doughnut',
  Legend: false,
  Colors: [
    {
      backgroundColor: ['#D5D1D1'],
      borderColor: ['#D5D1D1'],
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

  @Input() label: string;
  @Input() loading: boolean = false;
  @Input() selectedColor: string = '#e61042';

  @Output() selectedItemIndex = new EventEmitter<number>(null);

  selectedIndex: number = 0;
  backUpData: DoughnutChartData;

  @Input() set config(data: DoughnutChartData) {
    if (data?.total) {
      this.backUpData = data;
      this.initGraphData(data);
      const selectedIndex = this.doughnutGraphData.Data.findIndex(
        (item) => item !== 0
      );
      this.initTransparentGraph(selectedIndex);
      this.selectedItemIndex.emit(selectedIndex);
    } else {
      /**
       * need to refactor just random code
       */
      this.total = 0;
      this.selectedItemIndex.emit(0);

      this.backUpData = this.doughnutTransparentGraphData = {
        Labels: ['No Data'],
        Data: [100],
        Type: 'doughnut',
        Legend: false,
        Colors: [
          {
            backgroundColor: ['#D5D1D1'],
            borderColor: ['#D5D1D1'],
          },
        ],
        Options: DefaultDoughnutConfig,
      };

      this.doughnutTransparentGraphData = {
        Labels: ['No Data'],
        Data: [100],
        Type: 'doughnut',
        Legend: false,
        Colors: [
          {
            backgroundColor: ['#D5D1D1'],
            borderColor: ['#D5D1D1'],
          },
        ],
        Options: DefaultDoughnutConfig,
      };
      this.doughnutGraphData = {
        Labels: ['No Data'],
        Data: [100],
        Type: 'doughnut',
        Legend: false,
        Colors: [
          {
            backgroundColor: ['#D5D1D1'],
            borderColor: ['#D5D1D1'],
          },
        ],
        Options: DefaultDoughnutConfig,
      };
    }
  }
  @Input() total: number = 0;

  initGraphData(data: DoughnutChartData) {
    Object.assign(this.doughnutGraphData, deepCopy(data));
    Object.assign(this.doughnutTransparentGraphData, deepCopy(data));
  }

  initTransparentGraph(index: number) {
    const transparentColor = 'transparent';
    const colors = this.doughnutTransparentGraphData.Colors[0];

    colors.backgroundColor = colors?.backgroundColor?.map((item, idx) =>
      idx === index ? this.selectedColor : transparentColor
    );

    colors.borderColor = colors?.borderColor?.map((item, idx) =>
      idx === index ? this.selectedColor : transparentColor
    );

    this.doughnutGraphData.Colors[0].backgroundColor[
      index
    ] = this.selectedColor;
    this.doughnutGraphData.Colors[0].borderColor[index] = this.selectedColor;
  }

  constructor() {}

  ngOnInit(): void {}

  handleCircularGraphClick(data: any) {
    if (data.event.type === 'click' && this.doughnutGraphData.total) {
      const clickedIndex = data.active[0]?._index;
      this.selectedItemIndex.emit(clickedIndex);
      this.initGraphData(this.backUpData);
      this.initTransparentGraph(clickedIndex);
    }
  }
}
