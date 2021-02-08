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

  deserialize(statistics) {
    this.departments = new Array<any>();
    this.entities = {};
    Object.assign(
      this,
      set({}, 'npsStats', get(statistics, ['npsStats']))
    );
    this.departments.push({ key: 'ALL', value: 'All' });
    Object.keys(statistics.departments).forEach((key) => {
      this.departments.push({ key, value: statistics.departments[key] });
      this.entities[key] = new Entity().deserialize(statistics.entities[key]).data;
    });
    this.entities['ALL'] = new Entity().deserialize(statistics.entities['ALL']).data;
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
    Object.assign(
      this,
      set({}, 'source', get(statistics, ['source']))
    );
    Object.keys(statistics.departments).forEach((key) => {
      this.departments.push({ key, value: statistics.departments[key] });
      this.entities[key] = new Entity().deserialize(statistics.entities[key]).data;
    });
    this.entities['ALL'] = new Entity().deserialize(statistics.entities['ALL']).data;
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
    this.data.push({ label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true });
    for (const key in entity) {
      this.data.push({ label: entity[key], icon: '', value: key, total: 0, isSelected: false, type: 'initiated' });
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
  values: Distribution;
  percentage: Distribution;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'totalCount', get(input, ['totalCount'])),
    );
    this.values = new Distribution().deserialize(input, 'value');
    this.percentage = new Distribution().deserialize(input, 'percentage');
    return this;
  }
}

export class Distribution {
  veryPoor: number;
  poor: number;
  adequate: number;
  good: number;
  veryGood: number;
  outstanding: number;

  deserialize(input, type) {
    if (type === 'value') {
      Object.assign(
        this,
        set({}, 'veryPoor', get(input, ['veryPoor'])),
        set({}, 'poor', get(input, ['poor'])),
        set({}, 'adequate', get(input, ['adequate'])),
        set({}, 'good', get(input, ['good'])),
        set({}, 'veryGood', get(input, ['veryGood'])),
        set({}, 'outstanding', get(input, ['outstanding'])),
      )
      return this;
    } else {
      this.veryPoor = Math.round((input.veryPoor / input.totalCount) *100);
      this.poor = Math.round((input.poor / input.totalCount) *100);
      this.adequate = Math.round((input.adequate / input.totalCount) *100);
      this.good = Math.round((input.good / input.totalCount) *100);
      this.veryGood = Math.round((input.veryGood / input.totalCount) *100);
      this.outstanding = Math.round((input.outstanding / input.totalCount) *100);
      return this;
    }
  }
}
