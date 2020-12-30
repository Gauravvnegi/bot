import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class GSTService extends ApiService {
  addGSTDetail(reservationId: string, data) {
    return this.post(`/api/v1/reservation/${reservationId}/gst`, data);
  }
}
