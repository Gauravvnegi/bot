import { Injectable } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { get } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TabFiltersService {
  constructor(protected subscriptionService: SubscriptionPlanService) {}

  getSubscribedFilters(module: string, table: string, filters: any[] = []) {
    if (filters.length) {
      let getPath = ['modules', module, 'tables', table, 'tabFilters'];
      const subscription = this.subscriptionService.getModuleSubscription();
      let subscribedFilters = get(subscription, getPath, []);
      return subscribedFilters.length
        ? subscribedFilters.map(
            (filter) => filters.filter((d) => d.value === filter)[0]
          )
        : [];
    }
  }
}
