import { Injectable, Inject } from '@angular/core';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryConfig } from '../types';
import { UserListResponse } from '../types/response';
import {
  PermissionOption,
  UserConfig,
  UserResponse,
} from '@hospitality-bot/admin/shared';

@Injectable({ providedIn: 'root' })
export class ManagePermissionService extends ApiService {
  constructor(
    private _hotelDetailService: HotelDetailService,
    public httpClient: HttpClient,
    @Inject('BASE_URL') public baseUrl
  ) {
    super(httpClient, baseUrl);
  }

  modifyUserDetailsForEdit(value) {
    return {
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      status: value?.status,
      // hotelAccess: {
      //   brands: [
      //     {
      //       id: value.brandName,
      //       entities: [
      //         {
      //           id: value.branchName,
      //         },
      //       ],
      //     },
      //   ],
      // },
    };
  }

  modifyPermissionDetailsForEdit(
    value: Record<string, any> & { permissionConfigs: PermissionOption[] },
    adminDetail: UserConfig
  ): Partial<UserResponse> & { hotelAccess: any } {
    // to be changed when multiple hotels
    // temp function
    const products = adminDetail.products.filter((item) =>
      value.products?.includes(item.value)
    );

    return {
      status: value?.status,
      id: value.id,
      email: value.email.trim(),
      firstName: value.firstName,
      lastName: value.lastName,
      title: value.jobTitle,
      cc: value.cc,
      phoneNumber: value.phoneNumber,
      profileUrl: value.profileUrl,
      reportingTo: value.reportingTo,
      products: products.map((item) => ({
        id: item.id,
        label: item.label,
        module: item.value,
        productType: item.value,
        permissions: {
          manage: 1,
          view: 1,
        },
        productPermissions: value.permissionConfigs
          .filter((permissionItem) =>
            permissionItem.productType.includes(item.value)
          )
          .map((permissionItem) => ({
            ...permissionItem,
            permissions: {
              manage: permissionItem.permissions.manage !== 1 ? -1 : 1,
              view: permissionItem.permissions.view !== 1 ? -1 : 1,
            },
          })),
      })),
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

  updateRolesStatus(userId: string, statusData, config: QueryConfig) {
    return this.patch(
      `/api/v1/user/${userId}${config?.queryObj ?? ''}`,
      statusData
    );
  }

  getUserJobDetails(userId: string): Observable<any> {
    return this.get(`/api/v1/request/user/${userId}`);
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

  getAllUsers(entityId: string, config): Observable<UserListResponse> {
    return this.get(`/api/v1/entity/${entityId}/users${config.params ?? ''}`);
  }

  addNewUser(parentUserId: string, data: any) {
    return this.post(`/api/v1/user/${parentUserId}/add-user`, {
      ...data,
      parentId: parentUserId,
    });
  }

  exportCSV(config: QueryConfig, allUsers: boolean = false): Observable<any> {
    return this.get(
      `/api/v1/entity/${config.entityId}/users/export${
        config.queryObj ? config.queryObj : ''
      }`,
      {
        responseType: 'blob',
      }
    );
  }

  updateUserAvailability(
    userId: string,
    config: QueryConfig
  ): Observable<void> {
    return this.patch(
      `/api/v1/user/${userId}/available${config?.queryObj}`,
      {}
    );
  }
}
