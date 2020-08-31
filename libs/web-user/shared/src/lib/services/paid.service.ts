import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Subject } from 'rxjs/internal/Subject';
import { Amenity, Metadata, PaidServiceDetailDS } from '../data-models/paidServiceConfig.model';

@Injectable()
export class PaidService extends ApiService{

  isComponentRendered$ = new Subject();
  _amenityForm: FormGroup;
  _uniqueData;
  _amenitiesData;

  private _paidServiceDetailDS: PaidServiceDetailDS;

  initPaidAmenitiesDetailDS( amenities, selectedAmenities ) {
    this._paidServiceDetailDS = new PaidServiceDetailDS().deserialize(amenities, selectedAmenities);
  } 

  updateAmenitiesDS(selectedAmenities){ 
    this._paidServiceDetailDS.paidService = 
    new PaidServiceDetailDS().updateAminities(this.paidAmenities.paidService, selectedAmenities);
  }

  removeAmenity(reservationId, aminityId){
    return this.delete(`/api/v1/reservation/${reservationId}/special-amenity/${aminityId}`);
  }

  addAmenity(reservationId, data){
    return this.put(`/api/v1/reservation/${reservationId}/special-amenity`, data);
  }

  mapDataForAminity(amenityData,id){
    let data = new Amenity();
    data.id = id;
    data.metaData = new Metadata();
    data.metaData = amenityData;
    return data;
  }

  set amenityForm(form){
    this._amenityForm = form;
  }

  set amenityData(data){
    this._amenitiesData = data;
  }

  set uniqueData(uniqueData){
    this._uniqueData = uniqueData;
  }

  get amenityForm(){
    return this._amenityForm;
  }

  get amenityData(){
    return this._amenitiesData;
  }

  get uniqueData(){
    return this._uniqueData;
  }

  get paidAmenities(){
    return this._paidServiceDetailDS;
  }
}
