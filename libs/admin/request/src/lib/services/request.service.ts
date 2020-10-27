import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestService extends ApiService {
  getAllRequests(config): Observable<any> {
    return this.get(`/api/v1/live-request/${config.queryObj}`);
  }

  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/live-request/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }
}
