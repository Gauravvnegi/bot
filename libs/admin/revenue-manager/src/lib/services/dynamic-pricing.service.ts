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
      `/api/v1/members/?type=AGENT&entityId=f4baead1-06c6-42e8-821b-aef4a99ef5bb&order=DESC&sort=created&limit=50`
    ).pipe(map((response) => OccupancyResponse as DynamicPricingResponse));
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
