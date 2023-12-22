import { Injectable } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  BarPricePlanConfiguration,
  BarPricePlanFormControlName,
  ExtraPlanConfigFormData,
  PlanItems,
  PlanOption,
  PlanOptions,
} from '../types/setup-bar-price.types';
import { LevelType } from '../constants/setup-bar-price.const';

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

const extrasPlanOptions: PlanOption[] = [
  {
    label: 'Extra Bed',
    value: 'EXTRA_BED',
  },
  {
    label: 'Extra Child',
    value: 'EXTRA_CHILD',
  },
];

@Injectable()
export class SetupBarPriceService extends ApiService
  implements Record<BarPricePlanFormControlName, BehaviorSubject<Option[]>> {
  ratePlanBar = new BehaviorSubject<Option[]>([]);
  roomTypeBar = new BehaviorSubject<Option[]>([]);
  roomOccupancyBar = new BehaviorSubject<Option[]>([]);

  initPlans() {
    this.roomTypeBar.next(
      roomTypePlanOptions.map((item) => ({
        label: item.label,
        value: item.value,
      }))
    );

    this.ratePlanBar.next(
      ratePlanOptions.map((item) => ({
        label: item.label,
        value: item.value,
      }))
    );

    this.roomOccupancyBar.next(
      occupancyPlanOptions.map((item) => ({
        label: item.label,
        value: item.value,
      }))
    );
  }

  getPlanConfiguration(id?: string): Observable<BarPricePlanConfiguration> {
    return of({
      roomTypeBar: this.getDefaultOption(roomTypePlanOptions),
      ratePlanBar: this.getDefaultOption(ratePlanOptions),
      roomOccupancyBar: this.getDefaultOption(occupancyPlanOptions),
      extraBar: this.getExtraOption(),
    });
  }

  getExtraOption(): ExtraPlanConfigFormData {
    return {
      level: LevelType.ROOM_TYPE,
      hotelTypeConfig: extrasPlanOptions.map((item) => ({
        name: item.label,
        plan: item.value,
        price: 0,
      })),
      roomTypeConfig: roomTypePlanOptions.map((item) => ({
        roomType: item.value,
        roomTypeName: item.label,
        extraPrice: extrasPlanOptions.map((item) => ({
          name: item.label,
          plan: item.value,
          price: 0,
        })),
      })),
    };
  }

  getDefaultOption(plan: PlanOptions): PlanItems {
    const [basePlan, ...restPlan] = plan;
    const basePlanItem: PlanItems[0] = {
      name: basePlan.label,
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
        name: item.label,
        plan: item.value,
        modifierPrice: basePlan.price,
        currency: 'INR',
        modifierLevel: 0,
        parentPlan: basePlan.value,
      })),
    ];
  }
}
