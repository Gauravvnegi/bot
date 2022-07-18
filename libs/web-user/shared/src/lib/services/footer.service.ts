import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class FooterService extends ApiService {
  getCovidGallery(hotelId: any): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}/covid/galleries`);
  }
}
