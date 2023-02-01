import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class RoomService extends ApiService {
  getAmenities(hotelId: string): Observable<any> {
    return this.get(`/api/v1/packages?hotelId=${hotelId}`);
  }
}
