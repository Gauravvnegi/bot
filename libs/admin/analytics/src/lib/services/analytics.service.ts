import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class AnalyticsService extends ApiService {
  getConversationStats(hotelId: string) {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/stats/counts`);
  }
}
