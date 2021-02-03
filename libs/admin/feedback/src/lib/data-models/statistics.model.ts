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
