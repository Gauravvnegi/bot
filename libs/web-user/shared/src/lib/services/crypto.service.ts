import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

interface ITokenInfo {
  templateId: string;
  expiry: string;
  journey: string;
  reservationId: string;
  hotelId: string;
}

@Injectable({ providedIn: 'root' })
export class CryptoService extends ApiService {
  decryptToken(token): Observable<{ token: string }> {
    return this.post(`/api/v1/reservation/decrypt`, {
      token,
    });
  }

  // decryptToken(token) {
  //   let bytes = CryptoJS.AES.decrypt(token, 'h85yt8567');
  //   let originalText = bytes.toString(CryptoJS.enc.Utf8);
  // }

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
      expiry,
      journey,
      reservationId,
      hotelId,
    };
  }
}
