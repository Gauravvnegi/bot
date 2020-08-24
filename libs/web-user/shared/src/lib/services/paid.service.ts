import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { PaidServiceDetailDS } from '../data-models/paidServiceConfig.model';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup } from '@angular/forms';

@Injectable()
export class PaidService extends ApiService{

  isComponentRendered$ = new Subject();
  _amenityForm: FormGroup;
  _packageCode: string;
  _amenitiesData;

  private _paidServiceDetailDS: PaidServiceDetailDS;

  initPaidAmenitiesDetailDS( amenities, selectedAmenities ) {
    this._paidServiceDetailDS = new PaidServiceDetailDS().deserialize(amenities, selectedAmenities);
  } 

  addAmenity(reservationId, data){
    return this.put(`/api/v1/reservation/${reservationId}/special-amenities`, data);
  }

  updateAmenitiesDS(){
    
  }

  set amenityForm(form){
    this._amenityForm = form;
  }

  set amenityData(data){
    this._amenitiesData = data;
  }

  set packageCode(name:string){
    this._packageCode = name;
  }

  get amenityForm(){
    return this._amenityForm;
  }

  get amenityData(){
    return this._amenitiesData;
  }

  get packageCode(){
    return this._packageCode;
  }

  get paidAmenities(){
    return this._paidServiceDetailDS;
  }
}
