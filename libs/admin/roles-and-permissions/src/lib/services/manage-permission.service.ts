import { Injectable, Inject } from '@angular/core';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryConfig } from '../types';

@Injectable({ providedIn: 'root' })
export class ManagePermissionService extends ApiService {
  constructor(
    private _hotelDetailService: HotelDetailService,
    public httpClient: HttpClient,
    @Inject('BASE_URL') public baseUrl
  ) {
    super(httpClient, baseUrl);
  }

  modifyPermissionDetails(value) {
    // to be changed when multiple hotels
    // temp function
    return {
      email: value.email.trim(),
      firstName: value.firstName,
      lastName: value.lastName,
      title: value.jobTitle,
      cc: value.cc,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      permissions: value.permissionConfigs,
      hotelAccess: {
        chains: [
          {
            id: value.brandName,
            hotels: [
              {
                id: value.branchName,
              },
            ],
          },
        ],
      },
    };
  }

  modifyPermissionDetailsForEdit(value) {
    // to be changed when multiple hotels
    // temp function

    let selectedProducts = value.products.map((item) => item.value);
    return {
      id: value.id,
      email: value.email.trim(),
      firstName: value.firstName,
      lastName: value.lastName,
      title: value.jobTitle,
      cc: value.cc,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      departments: value.departments,
      permissions: value.permissionConfigs.filter(
        ({ permissions, productType }) =>
          (permissions.manage || permissions.view) &&
          selectedProducts.includes(productType)
      ),
      hotelAccess: {
        chains: [
          {
            id: value.brandName,
            hotels: [
              {
                id: value.branchName,
              },
            ],
          },
        ],
      },
    };
  }

  addUser(config): Observable<any> {
    return this.post(
      `/api/v1/user/${config.parentUserId}/add-user`,
      config.data
    );
  }

  updateUserDetailsById(data): Observable<any> {
    return this.put(`/api/v1/user/${data.parentId}`, data);
  }

  updateRolesStatus(userId, statusData) {
    return this.patch(`/api/v1/user/${userId}`, statusData);
  }

  getUserDetailsById(userId): Observable<any> {
    return this.get(`/api/v1/user/${userId}`);
  }

  getUserPermission(userId, config): Observable<any> {
    return this.get(`/api/v1/user/${userId}${config.queryObj}`);
  }

  getManagedUsers(
    config: QueryConfig,
    allUsers: boolean = false
  ): Observable<any> {
    return this.get(
      `/api/v1/${
        allUsers ? `hotel/${config.hotelId}` : `user/${config.loggedInUserId}`
      }/users${config.queryObj ?? ''}`
    );
  }

  addNewUser(parentUserId: string, data: any) {
    return this.post(`/api/v1/user/${parentUserId}/add-user`, {
      ...data,
      parentId: parentUserId,
    });
  }

  exportCSV(config: QueryConfig, allUsers: boolean = false): Observable<any> {
    return this.get(
      `/api/v1/${
        allUsers ? `hotel/${config.hotelId}` : `user/${config.loggedInUserId}`
      }/users/export/${config.queryObj ? config.queryObj : ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
