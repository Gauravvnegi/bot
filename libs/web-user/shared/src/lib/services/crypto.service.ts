import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { IToken, ITokenInfo } from 'libs/web-user/shared/src/lib/types/token';
import { Observable } from 'rxjs';

/**
 * @service_usage This service is to be registred in root and not override to any module
 */
@Injectable({ providedIn: 'root' })
export class CryptoService extends ApiService {
  decryptToken(token: string): Observable<IToken> {
    return this.post(`/api/v1/reservation/decrypt`, {
      token,
    });
  }

  extractTokenInfo(data: string): ITokenInfo {
    let templateId: string,
      expiry: string,
      journey: string,
      reservationId: string,
      hotelId: string;

    [templateId, data] = data.split('*');
    [expiry, data] = data.split('&');
    [journey, data] = data.split('$');
    [reservationId, data] = data.split('#');
    [hotelId, data] = data && data.split(' ');

    return {
      templateId,
      expiry: parseInt(expiry),
      journey,
      reservationId,
      hotelId,
    };
  }
}
