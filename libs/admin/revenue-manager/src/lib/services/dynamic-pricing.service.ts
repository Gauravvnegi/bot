import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import {
  DynamicPricingRequest,
  DynamicPricingResponse,
} from '../types/dynamic-pricing.types';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { Observable, throwError } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { OccupancyResponse } from '../constants/response.const';

@Injectable()
export class DynamicPricingService extends ApiService {
  createDynamicPricing(
    data: DynamicPricingRequest,
    entityId: string,
    config: QueryConfig
  ): Observable<DynamicPricingRequest> {
    return this.post(`/api/v1/revenue/dynamic-pricing${config.params}`, data, {
      header: { 'entity-id': entityId },
    });
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

  deleteDynamicPricing(entityId: string, deleteId: string) {
    return this.delete(
      `/api/v1/revenue/dynamic-pricing-configuration/${deleteId}`
    );
  }

  getOccupancyList(config?: QueryConfig): Observable<DynamicPricingResponse> {
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
    if (configCategory.value == 'ROOM_TYPE') {
      (roomTypes as FormArray).controls.forEach((room: FormGroup, index) => {
        if (room.get('isSelected').value) {
          isValid = isValid ? room.get('occupancy').valid : false;
        }
      });
    } else {
      (hotelConfig as FormArray).controls.forEach((rule: FormGroup) => {
        isValid = isValid ? rule.valid : false;
      });
    }
    return isValid;
  }
}
