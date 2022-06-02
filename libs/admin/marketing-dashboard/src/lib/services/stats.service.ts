import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class MarketingService extends ApiService {

    getMarketingCards(hotelId,config): Observable<any>{
    return this.get(`/api/v1/entity/${hotelId}/marketing-dashboard/marketing-stats${config.queryObj}`);
    }
    
    getContactStats(hotelId,config): Observable<any>{
        return this.get(`/api/v1/entity/${hotelId}/marketing-dashboard/contact-stats${config.queryObj}`)
    }
    
}