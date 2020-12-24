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
			set({}, 'npsGraph', get(statistics, ['npsGraph'])),
		);
		return this;
	}
}

export class NPSDepartments {
	[Departments.reservation]: Department;
	[Departments.maintenace]: Department;
	[Departments.houseKeeping]: Department;
	[Departments.frontOffice]: Department;
	[Departments.foodAndBeverages]: Department;

	deserialize(statistics) {
		Object.assign(
			this,
			set({}, [Departments.reservation], get(statistics, [Departments.reservation])),
			set({}, [Departments.maintenace], get(statistics, [Departments.maintenace])),
			set({}, [Departments.houseKeeping], get(statistics, [Departments.houseKeeping])),
			set({}, [Departments.frontOffice], get(statistics, [Departments.frontOffice])),
			set({}, [Departments.foodAndBeverages], get(statistics, [Departments.foodAndBeverages])),
		)

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