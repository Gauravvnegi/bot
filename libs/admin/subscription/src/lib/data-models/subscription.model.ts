import { get, set } from "lodash";
import * as moment from "moment";

export class SubscriptionPlan {
	plan: Plan;
	deploymentType: string;
	supportType: string;
	upgradable: boolean;

	deserialize(input) {
		Object.assign(
			this,
			set({}, 'deploymentType', get(input, ['deployment', 'type'])),
			set({}, 'supportType', get(input, ['technicalSupport', 'type'])),
			set({}, 'upgradable', get(input, ['upgradable'])),
		)
		this.plan = new Plan().deserialize(input.plan);
		return this;
	}
}

export class Plan {
  description: string;
  endDate: number;
  plan: string;
	startDate: number;
	
	deserialize(input) {
		Object.assign(
			this,
			set({}, 'description', get(input, ['description'])),
			set({}, 'plan', get(input, ['plan'])),
			set({}, 'endDate', get(input, ['endDate'])),
			set({}, 'startDate', get(input, ['startDate'])),
		)
		return this;
	}

	getStartDate() {
		return moment(this.startDate).format('DD/MM/YY');
	}

	getEndDate() {
		return moment(this.endDate).format('DD/MM/YY');
	}
}
