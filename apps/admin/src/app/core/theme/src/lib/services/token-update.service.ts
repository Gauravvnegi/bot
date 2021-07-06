import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/api.service';

@Injectable({ providedIn: 'root' })
export class TokenUpdateService extends ApiService {
  getUpdatedToken(hotelID: string) {
    return this.get(`/api/v1/hotel/${hotelID}/access-token`);
  }
}
