import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../../shared/utils/src/lib/services/api.service';
import { Amenity, PackageSource } from '../data-models/packageConfig.model';

@Injectable()
export class PackageService extends ApiService {
  uploadImage(entityId, data) {
    return this.post(
      `/api/v1/uploads?folder_name=entity/${entityId}/static-content/packages`,
      data
    );
  }

  exportCSV(config) {
    return this.get(`/api/v1/packages/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getHotelPackages(config) {
    return this.get(`/api/v1/packages${config.queryObj}`);
  }

  getHotelPackageCategories(entityId) {
    return this.get(`/api/v1/packages/categories?entityId=${entityId}`);
  }

  getPackageDetails(entityId, packageId) {
    return this.get(`/api/v1/entity/${entityId}/packages/${packageId}`);
  }

  updatePackage(entityId, packageId, data) {
    return this.patch(`/api/v1/entity/${entityId}/packages/${packageId}`, data);
  }

  addPackage(entityId, data) {
    return this.post(`/api/v1/entity/${entityId}/packages`, data);
  }

  updatePackageStatus(entityId, status, data) {
    return this.put(
      `/api/v1/entity/${entityId}/packages/status?active=${status}`,
      data
    );
  }

  mapPackageData(formValue, entityId, id?) {
    const packageData = new Amenity();
    packageData.active = formValue.status;
    packageData.entityId = entityId;
    packageData.imageUrl = formValue.imageUrl;
    packageData.packageCode = formValue.packageCode;
    packageData.id = id || '';
    packageData.parentId = formValue.category;
    packageData.name = formValue.name;
    packageData.description = formValue.description;
    packageData.currency = formValue.currency;
    packageData.rate = formValue.rate;
    packageData.quantity = 0;
    packageData.source = PackageSource.Botshot;
    packageData.startDate = 0;
    packageData.endDate = 0;
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
      const control = form.get(key);
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
