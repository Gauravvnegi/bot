import { ReportClass } from '../types/reports.types';
import {
  MarketSourceReportData,
  MarketSourceReportResponse,
} from '../types/scource-reports.types';

export class MarketSourceReport
  implements ReportClass<MarketSourceReportData, MarketSourceReportResponse> {
  records: MarketSourceReportData[];

  deserialize(value: MarketSourceReportResponse): this {
    this.records = new Array<MarketSourceReportData>();

    value &&
      Object.keys(value).forEach((key) => {
        this.records.push({
          company: key,
          nights: value[key].nights,
          occupancy: value[key].occupancyPercent,
          pax: value[key].pax,
          roomRevenue: value[key].roomRevenue,
          revenue: value[key].revenuePercent,
          arrOrAgr: value[key].arr,
          arp: value[key].arp,
        });
      });

    return this;
  }
}
