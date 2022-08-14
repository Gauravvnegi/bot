import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import {
  Amenity,
  Metadata,
  PaidServiceDetailDS,
  SubPackageDetailsConfigI,
} from '../data-models/paidServiceConfig.model';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { DateService } from '@hospitality-bot/shared/utils';

@Injectable()
export class PaidService extends ApiService {
  isComponentRendered$ = new Subject();
  _amenityForm: FormGroup;
  _uniqueData;
  _amenitiesData;

  private _paidServiceDetailDS: PaidServiceDetailDS;

  initPaidAmenitiesDetailDS(amenities, selectedAmenities, arrivalTime) {
    this._paidServiceDetailDS = new PaidServiceDetailDS().deserialize(
      amenities,
      selectedAmenities,
      arrivalTime
    );
  }

  setFieldConfigForSubPackageDetails() {
    let subPackageDetailsFieldSchema = {};

    subPackageDetailsFieldSchema['amenity'] = new FieldSchema().deserialize({
      label: '',
      disable: false,
    });

    return subPackageDetailsFieldSchema as SubPackageDetailsConfigI;
  }

  updateAmenitiesDS(selectedAmenities) {
    this._paidServiceDetailDS.paidService = new PaidServiceDetailDS().updateAmenities(
      this.paidAmenities.paidService,
      selectedAmenities
    );
  }

  removeAmenity(reservationId, aminityId) {
    return this.delete(
      `/api/v1/reservation/${reservationId}/packages/${aminityId}`
    );
  }

  updateAmenity(reservationId, data) {
    return this.put(`/api/v1/reservation/${reservationId}/packages`, data);
  }

  mapDataForAminityAddition(amenityData, timezone) {
    let data = new Amenity();
    data.packageId = amenityData.id;
    data.rate = amenityData.rate;
    data.metaData = new Metadata();
    if (
      amenityData.metaData &&
      Object.keys(amenityData.metaData).length > 0 &&
      amenityData.metaData.hasOwnProperty('pickupTime')
    ) {
      amenityData.metaData.pickupTime = this.mapAirportData(
        amenityData.metaData.pickupData,
        amenityData.metaData.pickupTime,
        timezone
      );
    }
    data.metaData = amenityData.metaData;
    return data;
  }

  updateDSForRemovedAmenity(papackageToBeRemove) {
    papackageToBeRemove.forEach((removedPackage) => {
      this._paidServiceDetailDS.paidService.forEach((paidService) => {
        paidService.subPackages.forEach((subPackage) => {
          if (subPackage.id === removedPackage.packageId) {
            subPackage.isSelected = false;
            subPackage.metaData = null;
          }
        });
      });
    });
  }

  mapAirportData(date, time, timezone) {
    const pickUpDateTimestamp = DateService.convertDateToTimestamp(date);
    const pickupDate = new Date(pickUpDateTimestamp * 1000).toISOString();
    const pickupTime = this.modifyPickUpData(time, pickupDate, timezone);
    return pickupTime;
  }

  modifyPickUpData(pickupTime, arrivalTime, timezone) {
    if (pickupTime) {
      let arrivalDate = arrivalTime.split('T')[0];
      let time = moment(pickupTime, 'hh:mm').format('hh:mm');
      return DateService.convertDateToTimestamp(arrivalDate + 'T' + time);
    }
  }

  mapDataForAmenityRemoval(packageId) {
    return { packageId: packageId };
  }

  validatePackageForm(packageForm: FormGroup) {
    let status = [];
    let packageFA = packageForm.get('subPackages') as FormArray;
    packageFA.controls.forEach((subPackageForm) => {
      if (
        subPackageForm.get('isSelected').value === true &&
        subPackageForm.invalid
      ) {
        status.push({
          validity: false,
          code: 'INVALID_FORM',
          msg: 'Invalid form. Please fill all the fields.',
        });
      }
    });

    return status;
  }

  set amenityForm(form) {
    this._amenityForm = form;
  }

  set uniqueData(uniqueData) {
    this._uniqueData = uniqueData;
  }

  get amenityForm() {
    return this._amenityForm;
  }

  get uniqueData() {
    return this._uniqueData;
  }

  get paidAmenities() {
    return this._paidServiceDetailDS;
  }
}
