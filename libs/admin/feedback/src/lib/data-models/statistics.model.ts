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

export class NPSAcrossServices {
	npsStats: Services;
    entities: ServiceEntities;
	
	deserialize(statistics) {
		this.npsStats = new Services().deserialize(statistics.npsStats);
		this.entities = new ServiceEntities().deserialize(statistics.entities);
		return this;
	}
}

export class Services {
	'Valet Service': Department;
	'Luggage Service': Department;
	'Public area cleaning': Department;
	'Room Cleaning': Department;
	beverages: Department;

	deserialize(statistics) {
		Object.assign(
			this,
			set({}, 'Valet Service', get(statistics, ['Valet Service'])),
			set({}, 'Luggage Service', get(statistics, ['Luggage Service'])),
			set({}, 'Public area cleaning', get(statistics, ['Public area cleaning'])),
			set({}, 'Room Cleaning', get(statistics, ['Room Cleaning'])),
			set({}, 'beverages', get(statistics, ['beverages'])),
		)
		return this;
	}
}

export class ServiceEntities {
	ALL: string[];
    'Front Office': string[];
    HouseKeeping: string[];
    'Food & Beverage': string[];
    Maintenance: string[];
	'SPA & Salon': string[];
	
	deserialize(statistics) {
		Object.assign(
			this,
			set({}, 'ALL', get(statistics, ['ALL'])),
			set({}, 'Front Office', get(statistics, ['Front Office'])),
			set({}, 'HouseKeeping', get(statistics, ['HouseKeeping'])),
			set({}, 'Maintenance', get(statistics, ['Maintenance'])),
			set({}, 'SPA & Salon', get(statistics, ['SPA & Salon'])),
		)

		return this;
	}
}

export class NPSTouchpoints {
	CHECKIN: CheckoutTouchPoints;
	CHECKOUT: CheckoutTouchPoints;
    entities: TouchpointEntities;
	source: string[];
	
	deserialize(statistics) {
		Object.assign(
			this,
			// set({}, 'CHECKIN', get(statistics, ['touchpoint', 'CHECKIN', 'npsStats'])),
			// set({}, 'CHECKOUT', get(statistics, ['touchpoint', 'CHECKOUT', 'npsStats'])),
			// set({}, 'entities', get(statistics, ['entities'])),
			set({}, 'source', get(statistics, ['source'])),
		)
		this.entities = new TouchpointEntities().deserialize(statistics.entities);
		this.CHECKIN = new CheckoutTouchPoints().deserialize(statistics.touchpoint.CHECKIN.npsStats);
		this.CHECKOUT = new CheckoutTouchPoints().deserialize(statistics.touchpoint.CHECKOUT.npsStats);
		return this;
	}
}

export class TouchpointEntities {
	ALL: string;
	'Front Office': string[];
	HouseKeeping: string[];
	'Food & Beverage': string[];
	Maintenance: string[];
	'SPA & Salon': string[];

	deserialize(statistics) {
		Object.assign(
			this,
			set({}, 'ALL', get(statistics, ['ALL'])),
			set({}, 'Front Office', get(statistics, ['Front Office'])),
			set({}, 'HouseKeeping', get(statistics, ['HouseKeeping'])),
			set({}, 'Maintenance', get(statistics, ['Maintenance'])),
			set({}, 'SPA & Salon', get(statistics, ['SPA & Salon'])),
		)

		return this;
	}
}

export class CheckoutTouchPoints {
	'Room Cleaning': Touchpoint;
	'Front Desk': Touchpoint;
	'Luggage Service': Touchpoint;

	deserialize(statistics) {
		Object.assign(
			this,
			set({}, 'Room Cleaning', get(statistics, ['Room Cleaning'])),
			set({}, 'Front Desk', get(statistics, ['Front Desk'])),
			set({}, 'Luggage Service', get(statistics, ['Luggage Service'])),
		)

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