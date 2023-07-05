import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { QueryConfig } from '../types/table.type';

export class ImportService extends ApiService {
  getServices(): Observable<any> {
    return this.get(`/api/v1/config?key=SERVICE_CONFIGURATION`);
  }

  getAttachedServices(
    endPoint: string,
    hotelId: string,
    config
  ): Observable<any> {
    return this.get(`/api/v1/${endPoint}${config?.params ?? ''}`, {
      headers: { 'hotel-id': hotelId },
    });
  }
}
