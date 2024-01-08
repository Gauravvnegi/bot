import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoomTypeList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  Rooms,
  RoomTypes,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { QueryConfig } from '@hospitality-bot/admin/shared';
import { UpdateBarPriceRequest } from '../types/bar-price.types';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class BarPriceService extends ApiService {
  isRoomDetailsLoaded = false;
  roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  getRoomDetails(entityId) {
    return this.get(
      `/api/v1/entity/${entityId}/inventory?roomTypeStatus=true&type=ROOM_TYPE&offset=0&limit=${100}`
    );
  }

  resetRoomDetails() {
    this.isRoomDetailsLoaded = false;
    this.roomDetails = new BehaviorSubject<RoomTypes[]>([]);
  }

  loadRoomTypes(entityId: string) {
    this.getRoomDetails(entityId).subscribe((res) => {
      const rooms = new RoomTypeList().deserialize(res).records;
      this.isRoomDetailsLoaded = true;
      this.roomDetails.next(new Rooms().deserialize(rooms));
    });
  }

  updateBarPrice(
    entityId: string,
    data: UpdateBarPriceRequest,
    config: QueryConfig
  ): Observable<UpdateBarPriceRequest> {
    return this.patch(
      `/api/v1/entity/${entityId}/inventory${config.params}`,
      data
    );
  }
}

/**
 * @function isDirty
 * @param control
 * @returns boolean
 * @description check if control is dirty or not
 */
export function isDirty(control: AbstractControl): boolean {
  if (control?.dirty) {
    return true;
  }

  if (control instanceof FormGroup) {
    return Object.values(control?.controls).some(this.isDirty);
  }

  return false;
}

export function markupValidator(form: AbstractControl) {
  form.get('isMarkup').valueChanges.subscribe((res) => {
    const discount = form.get('discount');
    if (res) {
      discount.setValidators([Validators.min(0), Validators.required]);
    } else {
      discount.setValidators([
        Validators.max(100),
        Validators.min(0),
        Validators.required,
      ]);
    }
    discount.updateValueAndValidity();
    if (discount.value || discount.value === 0) {
      discount.markAllAsTouched();
    }
  });
}
