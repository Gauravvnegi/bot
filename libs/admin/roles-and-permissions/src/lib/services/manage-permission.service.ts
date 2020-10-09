import { Injectable } from '@angular/core';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManagePermissionService extends ApiService {
  constructor(
    private _hotelDetailService: HotelDetailService,
    public httpClient: HttpClient
  ) {
    super(httpClient);
  }

  modifyPermissionDetails(value) {
    // to be changed when multiple hotels
    // temp function
    return {
      email: value.email,
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
    return {
      id: value.id,
      email: value.email,
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

  addUser(config): Observable<any> {
    return this.post(
      `/api/v1/user/${config.parentUserId}/add-user`,
      config.data
    );
  }

  updateUserDetailsById(config): Observable<any> {
    return this.put(`/api/v1/user/${config.parentUserId}`, config.data);
  }

  getUserDetailsById(userId): Observable<any> {
    return this.get(`/api/v1/user/${userId}`);
  }

  getManagedUsers(config): Observable<any> {
    return this.get(
      `/api/v1/user/${config.loggedInUserId}/users/${config.queryObj}`
    );
  }
}
