import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class StatisticsService extends ApiService {

  getStatistics(hotelId) {
    return this.get(`/api/v1/hotel/${hotelId}/stats`);
  }
}
