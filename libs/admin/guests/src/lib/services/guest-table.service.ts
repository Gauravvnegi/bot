import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class GuestTableService extends ApiService {
  getGuestList(config): Observable<any> {
    return this.get(`/api/v1/guests${config.queryObj}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/guests/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }
}
