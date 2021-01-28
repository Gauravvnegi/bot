import { get, set } from 'lodash';
import { Departments } from '../constants/departments';

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

  deserialize(statistics) {
		Object.assign(
			this,
			set({}, 'npsStats', get(statistics, ['npsStats'])),
			set({}, 'entities', get(statistics, ['entities']))
		);
    return this;
  }
}

export class NPSTouchpoints {
  CHECKIN: Touchpoint[];
  CHECKOUT: Touchpoint[];
  entities: string[];
  source: string[];

  deserialize(statistics) {
		this.CHECKIN = new Array<Touchpoint>();
		this.CHECKOUT = new Array<Touchpoint>();
		this.entities = new Array<string>();
    Object.assign(this, set({}, 'source', get(statistics, ['source'])));
    const entityKeys = Object.keys(statistics.entities);
    entityKeys.forEach((key) => {
      this.entities.push(key);
    });
    this.entities.reverse();
		if (Object.keys(statistics.touchpoint.CHECKIN.npsStats).length) {
			const keys = Object.keys(statistics.touchpoint.CHECKIN.npsStats);
			keys.forEach((key) => {
				this.CHECKIN.push(statistics.touchpoint.CHECKIN.npsStats[key]);
			});
		}
		if (Object.keys(statistics.touchpoint.CHECKOUT.npsStats).length) {
			const checkoutKeys = Object.keys(statistics.touchpoint.CHECKOUT.npsStats);
			checkoutKeys.forEach((key) => {
				this.CHECKOUT.push(statistics.touchpoint.CHECKOUT.npsStats[key]);
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
