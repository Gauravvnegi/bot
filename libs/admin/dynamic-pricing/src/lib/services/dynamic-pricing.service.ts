import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import {
  ConfigType,
  DynamicPricingRequest,
  DynamicPricingResponse,
} from '../types/dynamic-pricing.types';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { Observable, forkJoin } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { validateConfig } from '../models/dynamic-pricing.model';

@Injectable()
export class DynamicPricingService extends ApiService {
  createDynamicPricing(
    data: DynamicPricingRequest,
    entityId: string,
    config: QueryConfig
  ): Observable<DynamicPricingRequest> {
    return this.post(
      `/api/v1/revenue/dynamic-pricing-configuration${config.params}`,
      data,
      {
        header: { 'entity-id': entityId },
      }
    );
  }

  updateDynamicPricing(
    data: DynamicPricingRequest | { status: string },
    entityId: string,
    config: QueryConfig,
    updateId: string
  ): Observable<DynamicPricingRequest> {
    return this.patch(
      `/api/v1/revenue/dynamic-pricing-configuration/${updateId}${config.params}`,
      data,
      {
        header: { 'entity-id': entityId },
      }
    );
  }

  changeRuleStatus(
    seasonId: string,
    isActive: boolean,
    type: ConfigType
  ): Observable<DynamicPricingRequest> {
    return this.patch(
      `/api/v1/revenue/dynamic-pricing-configuration/${seasonId}?type=${type}`,
      { status: isActive ? 'ACTIVE' : 'INACTIVE' }
    );
  }

  deleteDynamicPricing(deleteId: string) {
    return this.delete(
      `/api/v1/revenue/dynamic-pricing-configuration/${deleteId}`
    );
  }

  getDynamicPricingList(
    config?: QueryConfig
  ): Observable<DynamicPricingResponse> {
    return this.get(
      `/api/v1/revenue/dynamic-pricing-configuration${config.params}`
    );
  }

  getDynamicPricingListing(config?: {
    type?: ConfigType;
    pagination?: boolean;
    fromDate?: number;
    toDate?: number;
  }): Observable<DynamicPricingResponse> {
    const { type, pagination } = {
      pagination: false,
      ...(config ?? {}),
    };

    return this.get(
      `/api/v1/revenue/dynamic-pricing-configuration?${
        type ? `type=${type}` : ''
      }&pagination=${pagination}`
    );
  }

  occupancyValidate(form: FormGroup): boolean {
    const {
      name,
      fromDate,
      toDate,
      selectedDays,
      roomTypes,
      configCategory,
      hotelConfig,
    } = form.controls;
    let isValid =
      name.valid && fromDate.valid && toDate.valid && selectedDays.valid;
    const ruleValidate = (rule: FormGroup) => {
      if (isValid) {
        const { start, end } = rule.controls;
        isValid = +start.value <= +end.value;
      }
    };
    if (configCategory.value == 'ROOM_TYPE') {
      (roomTypes as FormArray).controls.forEach((room: FormGroup, index) => {
        if (room.get('isSelected').value) {
          const rules = room.get('occupancy') as FormArray;
          isValid = isValid ? rules.valid : false;
          rules.controls.forEach((rule: FormGroup) => {
            ruleValidate(rule);
          });
        }
      });
    } else {
      (hotelConfig as FormArray).controls.forEach((rule: FormGroup) => {
        isValid = isValid ? rule.valid : false;
        ruleValidate(rule);
      });
    }
    return isValid;
  }

  triggerValidate(form: FormGroup): boolean {
    const { name, fromDate, toDate, selectedDays, hotelConfig } = form.controls;
    if (
      !name.valid ||
      !fromDate.valid ||
      !toDate.valid ||
      !selectedDays.valid ||
      !validateConfig(hotelConfig as FormArray, true)
    ) {
      return false;
    }

    return !(hotelConfig as FormArray).controls.some((config: FormGroup) =>
      this.triggerLevelValidator(config, true)
    );
  }

  triggerLevelValidator(
    group: FormGroup,
    submit = false
  ): ValidationErrors | null | boolean {
    const { fromTime, toTime, start, end } = group.controls;

    const validateControlPair = (
      control1: AbstractControl,
      control2: AbstractControl
    ): void => {
      const isGreater = +control1.value > +control2.value;

      if (control1.dirty) {
        control1.setErrors(isGreater ? { startError: true } : null);
        control2.setErrors(null);
      } else if (control2.dirty) {
        control2.setErrors(isGreater ? { endError: true } : null);
        control1.setErrors(null);
      } else {
        control1.setErrors(control1.errors);
        control2.setErrors(control2.errors);
      }
    };

    // validateControlPair(fromTime, toTime); // TODO: if require in future
    validateControlPair(start, end);

    if (submit) {
      return fromTime.errors || toTime.errors || start.errors || end.errors;
    }

    return null;
  }
}
