import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { get, set } from 'lodash';

export class Statistics {
  arrivals: Arrivals;
  inhouse: Inhouse;
  inhouseRequest: InhouseRequest;
  expressCheckIn: ExpressCheckIn;
  expressCheckOut: ExpressCheckOut;

  deserialize(statistics: any) {
    this.arrivals = new Arrivals().deserialize(statistics.arrivals);
    this.inhouse = new Inhouse().deserialize(statistics.inhouse.actual);
    this.inhouseRequest = new InhouseRequest().deserialize(statistics.inhouse);
    this.expressCheckIn = new ExpressCheckIn().deserialize(statistics.arrivals.expressCheckIn);
    this.expressCheckOut = new ExpressCheckOut().deserialize(statistics.departure.expressCheckout);
    return this;
  }
}
export class Arrivals {
	currentlyArrived: number;
	currentlyExpected: number;
  maxExpected: number;
  
  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'currentlyArrived', get(statistics.actual, ['totalCount'])),
      set({}, 'currentlyExpected', 140),
      set({}, 'maxExpected', get(statistics.expected, ['totalCount'])),
    );
    return this;
  }
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

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'requestApproved', get(statistics, ['acceptedRequest'])),
      set({}, 'requestPending', get(statistics, ['pendingRequest'])),
    );
    return this;
  }
}

export class Inhouse {
	adultCount: number;
  kidsCount: number;
  totalRoom: number;
  roomOccupied: number;

  deserialize(statistics: any) {
    Object.assign(
      this,
      set({}, 'adultCount', get(statistics, ['adults'])),
      set({}, 'kidsCount', get(statistics, ['kids'])),
      set({}, 'totalRoom', get(statistics, ['totalCount'])),
      set({}, 'roomOccupied', get(statistics, ['rooms'])),
    );
    return this;
  }
}

export class ExpressCheckIn {
  expected: number;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'expected', get(statistics.expected, ['totalCount'])),
    );
    return this;
  }
}

export class ExpressCheckOut {
  expected: number;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'expected', get(statistics.expected, ['totalCount'])),
    );
    return this;
  }
}
