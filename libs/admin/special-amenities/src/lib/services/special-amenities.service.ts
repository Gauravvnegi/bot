import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Amenity } from '../data-models/packageConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class SpecialAmenitiesService extends ApiService {
  uploadAmenityImage(hotelId, data) {
    return this.post(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/static-content/packages`,
      data
    );
  }

  exportCSV(config){
    return this.get(`/api/v1/packages/export${config.queryObj}`, {
      responseType: 'blob',
    })
  }

  getHotelPackages(config) {
    return this.get(
      `/api/v1/packages${config.queryObj}`
    );
  }

  getPackageDetails(hotelId, packageId) {
    return this.get(`/api/v1/hotel/${hotelId}/packages/${packageId}`);
  }

  updateAmenity(hotelId, packageId, data) {
    return this.patch(`/api/v1/hotel/${hotelId}/packages/${packageId}`, data);
  }

  addPackage(hotelId, data){
    return this.post(`/api/v1/hotel/${hotelId}/packages`,data);
  }

  updatePackageStatus(hotelId, status, data){
    return this.put(`/api/v1/hotel/${hotelId}/packages/status?active=${status}`,data);
  }

  mapAmenityData(formValue, hotelId, id?) {
    const amenityData = new Amenity();
    amenityData.active = formValue.status;
    amenityData.hotelId = hotelId;
    amenityData.imageUrl = formValue.imageUrl;
    amenityData.packageCode = formValue.packageCode;
    amenityData.id = id || '';
    amenityData.name = formValue.name;
    amenityData.description = formValue.description;
    amenityData.currency = formValue.currency;
    amenityData.rate = formValue.rate;
    amenityData.quantity = 0;
    amenityData.source = 'BOTSHOT'
    amenityData.startDate = 0;
    amenityData.endDate = 0
    amenityData.type = formValue.packageCode;
    amenityData.downloadUrl = '';
    amenityData.unit = formValue.unit;
    amenityData.autoAccept = formValue.autoAccept;
    return amenityData;
  }

  validateGuestDetailForm(packageForm: FormGroup) {
    let status = [];
    if (packageForm.invalid) {
      status = this.validate(packageForm, status);
    }
    return status;
  }

  validate(form, status, index?) {
    Object.keys(form.controls).forEach((key) => {
      let control = form.get(key);
      let msg;
      if (control.invalid) {
        if (control.value === '') {
          msg = `Please enter the ${key}`;
        } else {
          msg = `Please enter the valid ${key}`;
        }
        status.push({
          validity: false,
          msg: msg,
        });
      }
    });
    return status;
  }
}
