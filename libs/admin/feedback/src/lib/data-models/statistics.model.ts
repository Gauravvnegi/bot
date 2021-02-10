import { get, set } from 'lodash';

export class NPS {
  label: string;
  score: number;
  npsGraph: any;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'score', get(statistics, ['score'])),
      set({}, 'npsGraph', get(statistics, ['npsGraph']))
    );
    return this;
  }
}

export class NPSDepartments {
  departments: Department[];

  deserialize(statistics) {
    const keys = Object.keys(statistics);
    this.departments = new Array<Department>();
    keys.forEach((key) => {
      this.departments.push(statistics[key]);
    });
    return this;
  }
}

export class Department {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  difference: number;
  minScore: number;
  maxScore: number;
}

export class NPSAcrossServices {
  npsStats;
  entities;
  departments;
  services;

  deserialize(statistics) {
    this.departments = new Array<any>();
    this.services = new Array<any>();
    this.entities = {};
    Object.keys(statistics.departments).forEach((key) =>
      this.departments.push({ key, value: statistics.departments[key] })
    );
    this.services.push({
      label: 'All',
      icon: '',
      value: 'ALL',
      total: 0,
      isSelected: true,
      type: '',
    });
    Object.keys(statistics.services).forEach((key) => {
      this.services.push({
        label: statistics.services[key],
        icon: '',
        value: key,
        total: 0,
        isSelected: false,
        type: 'initiated',
      });
      this.entities[key] = [];
      Object.keys(statistics.entities[key]).forEach((entity) =>
        this.entities[key].push({
          entity,
          value: statistics.entities[key][entity],
          statistic: statistics.npsStats[key][entity],
        })
      );
    });
    return this;
  }
}

export class NPSTouchpoints {
  CHECKIN: Touchpoint[];
  CHECKOUT: Touchpoint[];
  entities;
  source: string[];
  departments;

  deserialize(statistics) {
    this.CHECKIN = new Array<Touchpoint>();
    this.CHECKOUT = new Array<Touchpoint>();
    this.departments = new Array<any>();
    this.entities = {};
    Object.assign(this, set({}, 'source', get(statistics, ['source'])));
    Object.keys(statistics.departments).forEach((key) => {
      this.departments.push({ key, value: statistics.departments[key] });
      this.entities[key] = new Entity().deserialize(
        statistics.entities[key]
      ).data;
    });
    this.entities['ALL'] = new Entity().deserialize(
      statistics.entities['ALL']
    ).data;
    // this.departments.reverse();
    for (const key in statistics.touchpoint.CHECKIN.npsStats) {
      this.CHECKIN.push(statistics.touchpoint.CHECKIN.npsStats[key]);
    }
    for (const key in statistics.touchpoint.CHECKOUT.npsStats) {
      this.CHECKOUT.push(statistics.touchpoint.CHECKOUT.npsStats[key]);
    }
    return this;
  }
}

export class Entity {
  data: any[];
  deserialize(entity) {
    this.data = new Array<any>();
    this.data.push({
      label: 'All',
      icon: '',
      value: 'ALL',
      total: 0,
      isSelected: true,
    });
    for (const key in entity) {
      this.data.push({
        label: entity[key],
        icon: '',
        value: key,
        total: 0,
        isSelected: false,
        type: 'initiated',
      });
    }
    return this;
  }
}

export class Touchpoint {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  difference: number;
  minScore: number;
  maxScore: number;
  colorCode: string;
}

export class FeedbackDistribution {
  totalCount: number;
  veryPoor: Distribution;
  poor: Distribution;
  adequate: Distribution;
  good: Distribution;
  veryGood: Distribution;
  outstanding: Distribution;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'totalCount', get(input, ['totalResponse'])),
      set({}, 'veryPoor', get(input, ['feedbacks', 'VERYPOOR'])),
      set({}, 'poor', get(input, ['feedbacks', 'POOR'])),
      set({}, 'adequate', get(input, ['feedbacks', 'ADEQUATE'])),
      set({}, 'good', get(input, ['feedbacks', 'GOOD'])),
      set({}, 'veryGood', get(input, ['feedbacks', 'VERYGOOD'])),
      set({}, 'outstanding', get(input, ['feedbacks', 'OUTSTANDING']))
    );
    return this;
  }
}

export class Distribution {
  label: string;
  scale: string;
  count: number;
  percent: number;
  color: string;
}

export class GlobalNPS {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'positive', get(input, ['positive'])),
      set({}, 'negative', get(input, ['negative'])),
      set({}, 'neutral', get(input, ['neutral']))
    );
    return this;
  }
}

export class PerformanceNPS {
  label: string;
  performances: Touchpoint[];

  deserialize(input) {
    this.performances = new Array<Touchpoint>();
    Object.assign(this, set({}, 'label', get(input, ['label'])));

    input.npsPerformace.TOP_PERFORMING.forEach((data) =>
      this.performances.push({ ...data, colorCode: '#1AB99F' })
    );

    input.npsPerformace.LOW_PERFORMING.forEach((data) =>
      this.performances.push({ ...data, colorCode: '#EF1D45' })
    );

    return this;
  }
}
