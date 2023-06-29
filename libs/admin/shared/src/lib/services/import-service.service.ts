import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

export class ImportService extends ApiService {
  getServices(): Observable<any> {
    return this.get(`/api/v1/config?key=SERVICE_CONFIGURATION`);
  }
}
