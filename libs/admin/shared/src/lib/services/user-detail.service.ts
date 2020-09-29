import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';
import { UserConfig } from '../../../../shared/src/lib/models/userConfig.model';
@Injectable({ providedIn: 'root' })
export class UserDetailService extends ApiService {
  userDetails;
  userPermissions;

  initUserDetails(data) {
    this.userPermissions = new UserConfig().deserialize(data);
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
}
