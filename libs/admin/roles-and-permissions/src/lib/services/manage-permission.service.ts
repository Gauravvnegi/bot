import { Injectable, Inject } from '@angular/core';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryConfig } from '../types';
import { UserListResponse } from '../types/response';

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
      departments: value.departments,
      hotelAccess: {
        brands: [
          {
            id: value.brandName,
            entities: [
              {
                id: value.branchName,
              },
            ],
          },
        ],
      },
    };
  }

  modifyUserDetailsForEdit(value) {
    return {
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      permissions:
        value.permissionConfigs?.map((item) => ({
          ...item,
          permissions: {
            manage: item.permissions.manage,
            view: item.permissions.view,
          },
        })) ?? [],
      hotelAccess: {
        brands: [
          {
            id: value.brandName,
            entities: [
              {
                id: value.branchName,
              },
            ],
          },
        ],
      },
    };
  }

  modifyPermissionDetailsForEdit(value, allDepartments) {
    // to be changed when multiple hotels
    // temp function

    return {
      id: value.id,
      email: value.email.trim(),
      firstName: value.firstName,
      lastName: value.lastName,
      title: value.jobTitle,
      cc: value.cc,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      departments: allDepartments.filter((item) =>
        value.departments?.includes(item.department)
      ),
      permissions: value.permissionConfigs.filter(
        ({ permissions, productType }) =>
          (permissions.manage || permissions.view) &&
          value.products?.includes(productType)
      ),
      hotelAccess: {
        brands: [
          {
            id: value.brandName,
            entities: [
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

  editUserDetails(data): Observable<any> {
    return this.put(`/api/v1/user/${data.id}`, data);
  }

  updateRolesStatus(userId: string, statusData) {
    return this.patch(`/api/v1/user/${userId}`, statusData);
  }

  getUserDetailsById(userId: string): Observable<any> {
    return this.get(`/api/v1/user/${userId}`);
  }

  getUserPermission(userId: string, config: QueryConfig): Observable<any> {
    return this.get(`/api/v1/user/${userId}${config.queryObj}`);
  }

  // getManagedUsers(
  //   config: QueryConfig,
  //   allUsers: boolean = false
  // ): Observable<UserListResponse> {
  //   return this.get(
  //     `/api/v1/${
  //       allUsers ? `entity/${config.entityId}` : `user/${config.loggedInUserId}`
  //     }/users${config.queryObj ?? ''}`
  //   );
  // }

  getManagedUsers(config: QueryConfig): Observable<UserListResponse> {
    return this.get(
      `/api/v1/user/${config.loggedInUserId}/users${config.queryObj ?? ''}`
    );
  }

  getAllUsers(config: QueryConfig): Observable<UserListResponse> {
    return this.get(
      `/api/v1/entity/${config.entityId}/users${config.queryObj ?? ''}`
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
        allUsers ? `entity/${config.entityId}` : `user/${config.loggedInUserId}`
      }/users/export/${config.queryObj ? config.queryObj : ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
