import { Injectable } from '@angular/core';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { SnackBarService } from 'libs/shared/material/src';
import { get } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(
    protected subscriptionService: SubscriptionPlanService,
    private snackBarService: SnackBarService
  ) {}

  getSubscribedFilters(
    module: string,
    table: string,
    filters: any[] = []
  ): any[] {
    const validityStatus = this.validateInputs(module, table);
    if (!validityStatus.status) {
      this.snackBarService.openSnackBarAsText(validityStatus.error);
    }
    if (filters.length) {
      const getPath = ['modules', module, 'tables', table, 'tabFilters'];
      const subscription = this.subscriptionService.getModuleSubscription();
      const subscribedFilters = get(subscription, getPath, []);
      return subscribedFilters.length
        ? subscribedFilters.map(
            (filter) => filters.filter((d) => d.value === filter)[0]
          )
        : [];
    }
    return filters;
  }

  validateInputs(module, table) {
    if (!Object.values(ModuleNames).includes(module)) {
      return {
        status: false,
        error: 'Module not found.',
      };
    } else if (!Object.values(TableNames).includes(table)) {
      return {
        status: false,
        error: 'Table not found.',
      };
    } else {
      return { status: true };
    }
  }
}
