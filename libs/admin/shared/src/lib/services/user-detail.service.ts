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
        ?.brands ??
      data.hotelAccess?.brands ??
      [];

    this.hotels = new Hotels().deserialize(brandData);
  }

  getLoggedInUserId() {
    return localStorage.getItem(tokensConfig.userId);
  }

  getHotelId() {
    return localStorage.getItem(tokensConfig.hotelId);
  }

  uploadProfileImage(hotelId: string, formData) {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=entity/${hotelId}/profileImage`,
      formData
    );
  }

  getUserDetailsById(userId): Observable<UserResponse> {
    return this.get(`/api/v1/user/${userId}`);
  }

  getUserShareIconByNationality(nationality): Observable<any> {
    return this.get(
      `/api/v1/countries/support-applications?nationality=${nationality}`
    );
  }

  getUserPermission(feedbackType: string) {
    return this.get(
      `/api/v1/user/${this.getLoggedInUserId()}/module-permission?module=${feedbackType}`
    );
  }

  getUsersList(config: { hotelId: string; queryObj?: string }) {
    return this.get(
      `/api/v1/entity/${config.hotelId}/users${config.queryObj ?? ''}`
    );
  }

  getMentionList(hotelId: string) {
    return this.get(`/api/v1/entity/${hotelId}/users?mention=true`);
  }

  uploadImage(hotelId: string, data: any, path: string) {
    return this.post(
      `/api/v1/uploads?folder_name=entity/${hotelId}/${path}`,
      data
    );
  }
}
