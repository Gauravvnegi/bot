import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../../shared/utils/src/lib/api.service';
import { Amenity, PackageSource } from '../data-models/packageConfig.model';

@Injectable()
export class PackageService extends ApiService {
  uploadImage(hotelId, data) {
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

  getHotelPackageCategories(hotelId){
    return this.get(`/api/v1/packages/categories?hotelId=${hotelId}`);
  }

  getPackageDetails(hotelId, packageId) {
    return this.get(`/api/v1/hotel/${hotelId}/packages/${packageId}`);
  }

  updatePackage(hotelId, packageId, data) {
    return this.patch(`/api/v1/hotel/${hotelId}/packages/${packageId}`, data);
  }

  addPackage(hotelId, data){
    return this.post(`/api/v1/hotel/${hotelId}/packages`,data);
  }

  updatePackageStatus(hotelId, status, data){
    return this.put(`/api/v1/hotel/${hotelId}/packages/status?active=${status}`,data);
  }

  mapPackageData(formValue, hotelId, id?) {
    const packageData = new Amenity();
    packageData.active = formValue.status;
    packageData.hotelId = hotelId;
    packageData.imageUrl = formValue.imageUrl;
    packageData.packageCode = formValue.packageCode;
    packageData.id = id || '';
    packageData.parentId = formValue.category;
    packageData.name = formValue.name;
    packageData.description = formValue.description;
    packageData.currency = formValue.currency;
    packageData.rate = formValue.rate;
    packageData.quantity = 0;
    packageData.source = PackageSource.Botshot
    packageData.startDate = 0;
    packageData.endDate = 0
    packageData.type = formValue.type;
    packageData.downloadUrl = '';
    packageData.unit = formValue.unit;
    packageData.autoAccept = formValue.autoAccept;
    return packageData;
  }

  validatePackageDetailForm(packageForm: FormGroup) {
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
