import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
export class Arrivals {
	currentlyArrived: number;
	currentlyExpected: number;
	maxExpected: number;
}

export class Customer {
	total: number;
  bot: number;
  vip: number;
  chartData: ChartDataSets[];
  chartLabels: Label[];
  chartOptions: ChartOptions;
  chartColors: Color[];
  chartLegend: boolean;
  chartType: string;
}

export class InhouseRequest {
	requestApproved: number;
  requestPending: number;
}

export class Inhouse {
	adultCount: number;
  kidsCount: number;
  totalRoom: number;
  roomOccupied: number;
}
