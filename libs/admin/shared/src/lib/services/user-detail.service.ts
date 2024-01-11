import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import {
  Hotels,
  UserConfig,
} from '../../../../shared/src/lib/models/userConfig.model';
import { tokensConfig } from '../constants/common';
import { UserResponse } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class UserService extends ApiService {
  userDetails: UserConfig;
  userPermissions;
  hotels: Hotels;

  initUserDetails(data: UserResponse) {
    this.userDetails = new UserConfig().deserialize(data);

    const brandData =
      data.sites?.find((item) => item.id === this.userDetails.siteName)
        ?.brands ?? [];

    this.hotels = new Hotels().deserialize(brandData);
  }

  getLoggedInUserId() {
    return localStorage.getItem(tokensConfig.userId);
  }

  getentityId() {
    return localStorage.getItem(tokensConfig.entityId);
  }

  uploadProfileImage(entityId: string, formData) {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=entity/${entityId}/profileImage`,
      formData
    );
  }

  getUserDetailsById(userId): Observable<UserResponse> {
    return this.get(`/api/v1/user/${userId}?includeDepartment=true`);
  }

  getUserShareIconByNationality(nationality): Observable<any> {
    return this.get(
      `/api/v1/countries/support-applications?nationality=${nationality}`
    );
  }

  getUserPermission(feedbackType: string) {
    return this.get(
      `/api/v1/user/${this.getLoggedInUserId()}/module-permission?module=${feedbackType}&includeDepartment=true`
    );
  }

  getUsersList(config: { entityId: string; queryObj?: string }) {
    return this.get(
      `/api/v1/entity/${config.entityId}/users${config.queryObj ?? ''}`
    );
  }

  getMentionList(entityId: string) {
    return this.get(`/api/v1/entity/${entityId}/users?mention=true`);
  }

  uploadImage(entityId: string, data: any, path: string) {
    return this.post(
      `/api/v1/uploads?folder_name=entity/${entityId}/${path}`,
      data
    );
  }
}
