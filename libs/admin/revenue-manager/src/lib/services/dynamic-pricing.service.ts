import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import {
  DynamicPricingRequest,
  DynamicPricingResponse,
} from '../types/dynamic-pricing.types';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { Observable } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable()
export class DynamicPricingService extends ApiService {
  createDynamicPricing(
    data: DynamicPricingRequest,
    entityId: string,
    config: QueryConfig
  ): Observable<DynamicPricingRequest> {
    return this.post(
      `/api/v1/revenue/dynamic-pricing-configuration/${config.params}`,
      data,
      {
        header: { 'entity-id': entityId },
      }
    );
  }

  updateDynamicPricing(
    data: DynamicPricingRequest,
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
}
