import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { PaidServiceDetailDS, Amenity, Metadata } from '../data-models/paidServiceConfig.model';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup } from '@angular/forms';

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

  addAmenity(reservationId, data){
    return this.put(`/api/v1/reservation/${reservationId}/special-amenity`, data);
  }

  mapDataForAminity(amenityData,id){
    let data = new Amenity();
    data.id = id;
    data.metaData = new Metadata();
    data.metaData.airportName = amenityData.metaData.airportName;
    data.metaData.flightNumber = amenityData.metaData.flightNumber;
    data.metaData.personCount = amenityData.metaData.personCount;
    data.metaData.pickupTime = amenityData.metaData.pickupTime;
    data.metaData.terminal = amenityData.metaData.terminal;
    return data;
  }

  // updateAmenitiesDS(packageCode, metaData){ 
    
  // }

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
