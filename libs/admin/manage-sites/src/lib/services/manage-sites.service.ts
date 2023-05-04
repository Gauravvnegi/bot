import { Injectable } from '@angular/core';
import { UserResponse } from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { ManageSiteStatus } from '../constant/manage-site';
import { QueryConfig } from '../types/manage-site.type';
import { ManageSiteListResponse } from '../types/response.type';

@Injectable({ providedIn: 'root' })
export class ManageSitesService extends ApiService {
  /**
   * @function getSitesList Get all the site data
   * @param userId User Id
   * @returns
   */
  getSitesList(
    userId: string,
    config?: QueryConfig
  ): Observable<ManageSiteListResponse> {
    return this.get(`/api/v1/sites${config?.params ?? ''}`);
  }

  updateSiteStatus(
    userId: string,
    hotelId: string,
    status: ManageSiteStatus
  ): Observable<any> {
    return this.patch(
      `/api/v1/user/${userId}/sites/${hotelId}?status=${status}`,
      {}
    );
  }

  updateUserDetails(data: Partial<UserResponse>): Observable<any> {
    return this.put(`/api/v1/user/${data.parentId}`, data);
  }
}
