import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../data-models/subscription-plan-config.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends ApiService {
	private subscriptions: SubscriptionPlan;
  getSubscriptionPlan(hotelId: string): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/subscription-plan`);
	}
	
	setSubscription(data) {
		this.subscriptions = data;
	}

	getSubscription() {
		return this.subscriptions;
	}
}
