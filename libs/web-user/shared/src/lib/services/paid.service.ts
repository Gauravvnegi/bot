import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { PaidServiceDetailDS } from '../data-models/paidServiceConfig.model';

@Injectable()
export class PaidService extends ApiService{

  private _paidServiceDetailDS: PaidServiceDetailDS;

  initPaidAmenitiesDetailDS( amenities ) {
    this._paidServiceDetailDS = new PaidServiceDetailDS().deserialize(amenities);
  } 

  get paidAmenities(){
    return this._paidServiceDetailDS;
  }
}
