import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable({ providedIn: 'root' })
export class CryptoService extends ApiService {
  decryptToken(token) {
    // return of(
    //   'temp000001*1595995155870&PRECHECKIN$8f7a6be7-d366-43db-b47d-6fcf1a25dbea'
    // );
    return this.post(`/api/v1/reservation/decrypt`, {
      token,
    });
  }

  // decryptToken(token) {
  //   let bytes = CryptoJS.AES.decrypt(token, 'h85yt8567');
  //   let originalText = bytes.toString(CryptoJS.enc.Utf8);
  // }

  extractTokenInfo(data) {
    let templateId, expiry, journey, reservationId, hotelId;

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
