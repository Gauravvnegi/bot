import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/utils/src/lib/services/api.service';
import { FormGroup } from '@angular/forms';
import { Category } from '../data-models/categoryConfig.model';

@Injectable()
export class CategoriesService extends ApiService {
  _categoriesList;

  exportCategoryCSV(config) {
    return this.get(`/api/v1/packages/categories/export${config.queryObj}`, {
      responseType: 'blob',
    });
  }

  getHotelCategories(config) {
    return this.get(`/api/v1/packages/categories${config.queryObj}`);
  }

  getCategoryDetails(hotelId, categoryId) {
    return this.get(
      `/api/v1/hotel/${hotelId}/packages/categories/${categoryId}`
    );
  }

  updateCategory(hotelId, categoryId, data) {
    return this.patch(
      `/api/v1/hotel/${hotelId}/packages/categories/${categoryId}`,
      data
    );
  }

  addCategory(hotelId, data) {
    return this.post(`/api/v1/hotel/${hotelId}/packages/categories`, data);
  }

  mapCategoryData(formValue, id?) {
    const categoryData = new Category();
    categoryData.name = formValue.name;
    categoryData.description = formValue.description;
    categoryData.imageUrl = formValue.imageUrl;
    categoryData.active = true;
    categoryData.id = id || '';
    categoryData.packageCode = formValue.packageCode;
    return categoryData;
  }

  validateCategoryDetailForm(categoryForm: FormGroup) {
    let status = [];
    if (categoryForm.invalid) {
      status = this.validate(categoryForm, status);
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
