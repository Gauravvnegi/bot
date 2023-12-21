import { Injectable } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable, of } from 'rxjs';
import {
  BarPricePlanConfiguration,
  BarPricePlanFormControl,
  PlanItem,
  PlanItems,
  PlanOption,
  PlanOptions,
} from '../types/setup-bar-price.types';

const ratePlanOptions: PlanOptions = [
  {
    label: 'EP',
    value: 'EP',
    isBase: true,
    price: 0,
  },
  { label: 'CP', value: 'CP' },
  { label: 'MAP', value: 'MAP' },
  { label: 'AP', value: 'AP' },
];

const roomTypePlanOptions: PlanOptions = [
  {
    label: 'Standard',
    value: 'STANDARD',
    isBase: true,
    price: 12000,
  },
  { label: 'Deluxe', value: 'DELUXE' },
  { label: 'Premium', value: 'PREMIUM' },
  { label: 'Suite', value: 'SUITE' },
];

const occupancyPlanOptions: PlanOptions = [
  {
    label: 'Single',
    value: 'SINGLE',
    isBase: true,
    price: 0,
  },
  { label: 'Double', value: 'DOUBLE' },
  { label: 'Triple', value: 'TRIPLE' },
  { label: 'Quadruple', value: 'QUADRUPLE' },
  { label: 'Quintuple', value: 'QUINTUPLE' },
  { label: 'Sextuple', value: 'SEXTUPLE' },
  { label: 'Septuple', value: 'SEPTUPLE' },
  { label: 'Octuple', value: 'OCTUPLE' },
  { label: 'Nonuple', value: 'NONUPLE' },
  { label: 'Decuple', value: 'DECUPLE' },
  { label: 'Undecuple', value: 'UNDECUPLE' },
  { label: 'Duodecuple', value: 'DUODECUPLE' },
];

@Injectable()
export class SetupBarPriceService extends ApiService {
  getPlanConfiguration(id?: string): Observable<BarPricePlanConfiguration> {
    return of({
      roomTypeBar: this.getDefaultOption(roomTypePlanOptions),
      ratePlanBar: this.getDefaultOption(ratePlanOptions),
      roomOccupancyBar: this.getDefaultOption(occupancyPlanOptions),
    });
  }

  getDefaultOption(plan: PlanOptions): PlanItems {
    const [basePlan, ...restPlan] = plan;
    const basePlanItem: PlanItems[0] = {
      label: basePlan.label,
      plan: basePlan.value,
      modifierPrice: basePlan.price,
      currency: 'INR',
      modifierLevel: 0,
      parentPlan: basePlan.value,
      isBase: true,
    };

    return [
      basePlanItem,
      ...restPlan.map((item) => ({
        label: item.label,
        plan: item.value,
        modifierPrice: basePlan.price,
        currency: 'INR',
        modifierLevel: 0,
        parentPlan: basePlan.value,
      })),
    ];
  }
}
