import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { QueryConfig } from '@hospitality-bot/admin/shared';

@Injectable()
export class GuestTableService extends ApiService {
  getGuestList(config): Observable<any> {
    return this.get(`/api/v1/members${config.params}`);
  }

  getGuestById(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}`);
  }

  addGuest(data, config?: QueryConfig): Observable<any> {
    return this.post(`/api/v1/members${config.params}`, data);
  }

  updateGuest(data, guestId: string, config?: QueryConfig): Observable<any> {
    return this.patch(`/api/v1/members/${guestId}`, data);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/members/export/${config.params}`, {
      responseType: 'blob',
    });
  }

  getAllGuestStats(config): Observable<any> {
    return this.get(`/api/v1/members/stats/${config.params}`);
  }

  exportCSVStat(config): Observable<any> {
    return this.get(`/api/v1/members/stats/export/${config.params}`, {
      responseType: 'blob',
    });
  }
}
