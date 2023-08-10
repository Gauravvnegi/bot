import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { DynamicPricingRequest } from '../types/dynamic-pricing.types';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { Observable } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable()
export class DynamicPricingService extends ApiService {
  createDynamicPricing(
    data: DynamicPricingRequest,
    entityId: string,
    config?: QueryConfig
  ): Observable<DynamicPricingRequest> {
    return this.post(`/api/v1/revenue/dynamic-pricing${config?.params}`, data, {
      header: { 'entity-id': entityId },
    });
  }

  updateDynamicPricing(
    data: DynamicPricingRequest,
    entityId: string,
    config?: QueryConfig
  ): Observable<DynamicPricingRequest> {
    return this.patch(`/api/v1/revenue/dynamic-pricing${config.params}`, data, {
      header: { 'entity-id': entityId },
    });
  }

  occupancyValidate(
    form: FormGroup
  ): { status: boolean; invalidList: number[] } {
    const {
      name,
      fromDate,
      toDate,
      roomType,
      selectedDays,
      roomTypes,
    } = form.controls;
    let isValid =
      name.valid &&
      fromDate.valid &&
      toDate.valid &&
      roomType.valid &&
      selectedDays.valid;

    let invalidRoomIndex = [];
    (roomTypes as FormArray).controls.forEach((room: FormGroup, index) => {
      if (room.get('isSelected').value) {
        isValid = isValid ? room.get('occupancy').valid : false;
        invalidRoomIndex.push(index);
      }
    });
    return { status: isValid, invalidList: invalidRoomIndex };
  }
}
