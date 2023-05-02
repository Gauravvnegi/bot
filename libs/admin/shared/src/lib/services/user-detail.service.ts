import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import {
  Hotel,
  Hotels,
  UserConfig,
} from '../../../../shared/src/lib/models/userConfig.model';
import { UserData } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class UserService extends ApiService {
  userDetails: UserConfig;
  userPermissions;
  hotels: Hotels;

  initUserDetails(data) {
    this.userDetails = new UserConfig().deserialize(data);
    if (data.hotelAccess?.chains[0]?.hotels?.length)
      this.hotels = new Hotels().deserialize(data.hotelAccess.chains[0].hotels);
  }

  setLoggedInUserId(userId) {
    localStorage.setItem('userId', userId);
  }

  getLoggedInUserId() {
    return localStorage.getItem('userId');
  }

  getHotelId() {
    return this.userDetails.branchName;
  }

  uploadProfile(data) {
    return this.post(`/api/v1/uploads?folder_name=hotel/roseate/banner`, data);
  }

  uploadProfileImage(hotelId: string, formData) {
    return this.uploadDocumentPost(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/profileImage`,
      formData
    );
  }

  getUserDetailsById(userId): Observable<UserData> {
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
      `/api/v1/hotel/${config.hotelId}/users${config.queryObj ?? ''}`
    );
  }

  getMentionList(hotelId: string) {
    return this.get(`/api/v1/hotel/${hotelId}/users?mention=true`);
  }

  uploadImage(hotelId: string, data: any, path: string) {
    return this.post(
      `/api/v1/uploads?folder_name=hotel/${hotelId}/${path}`,
      data
    );
  }
}
