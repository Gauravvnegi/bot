import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { UserConfig } from '../../../../shared/src/lib/models/userConfig.model';
@Injectable({ providedIn: 'root' })
export class UserService extends ApiService {
  userDetails;

  initUserDetails(data) {
    this.userDetails = new UserConfig().deserialize(data);
  }

  setLoggedInUserId(userId) {
    localStorage.setItem('userId', userId);
  }

  getLoggedInUserid() {
    return localStorage.getItem('userId');
  }

  getUserDetailsById(userId): Observable<any> {
    return this.get(`/api/v1/user/${userId}`);
  }

  getUserShareIconByNationality(nationality): Observable<any> {
    return this.get(
      `/api/v1/countries/support-applications?nationality=${nationality}`
    );
  }

  getUserPermission(feedbackType: string) {
    return this.get(
      `/api/v1/user/${this.getLoggedInUserid()}/module-permission?module=${feedbackType}'`
    );
  }
}
