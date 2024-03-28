import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { GraphStatsData, QueryConfig } from '../components/types/stats';
import {
  CampaignListResponse,
  EMarketStatsResponse,
} from '../components/types/campaign.response.type';

@Injectable()
export class MarketingService extends ApiService {
  $eMarketStatsConfig = new EventEmitter<any>(null);

  getMarketingCards(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/marketing-dashboard/marketing-stats${config.queryObj}`
    );
  }

  getContactStats(entityId: string, config: QueryConfig): Observable<any> {
    return this.get(
      `/api/v1/entity/${entityId}/marketing-dashboard/contact-stats${config.queryObj}`
    );
  }

  /**
   * @function getHotelCampaign get campaign list from api.
   * @param config dynamically getting global query filter into api.
   * @param entityId dynamically getting entityId into api.
   * @returns get api of campaign lists.
   */
  getCampaignList(
    entityId: string,
    config: { params }
  ): Observable<CampaignListResponse> {
    return this.get(`/api/v1/cms/${entityId}/campaign${config.params}`);
  }

  getEMarketStats(
    entityId: string,
    config: { params: string }
  ): Observable<EMarketStatsResponse> {
    return this.get(
      `/api/v1/entity/${entityId}/marketing-dashboard/campaign-stats${
        config?.params ?? ''
      }`
    );
  }

  rateGraphStats(
    entityId: string,
    config: QueryConfig
  ): Observable<GraphStatsData[]> {
    return this.get(
      `/api/v1/entity/${entityId}/marketing-dashboard/open-vs-click${config.queryObj}`
    ).pipe(
      map((res) => {
        return res.map((item) => ({
          label: item.label,
          primaryData: item.openRate,
          secondaryData: item.clickRate,
        }));
      })
    );
  }

  subscriberGraphStats(
    entityId: string,
    config: any
  ): Observable<GraphStatsData[]> {
    return this.get(
      `/api/v1/entity/${entityId}/marketing-dashboard/subscribers-vs-unsubscribers${config.queryObj}`
    ).pipe(
      map((res) => {
        return res.map((item) => {
          const [key, value] = Object.entries(item)[0];
          return {
            label: key,
            primaryData: value['Unsubscribers'],
            secondaryData: value['Subscribers'],
          };
        });
      })
    );
  }
}
