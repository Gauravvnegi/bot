import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class SentimentalAnalysisService extends ApiService {
  getOverallSentiment(config): Observable<any> {
    return this.get(`${config.queryObj}`);
  }
}
