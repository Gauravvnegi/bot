import { toCurrency } from 'libs/admin/shared/src/lib/utils/valueFormatter';
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
          roomRevenue: toCurrency(value[key].roomRevenue),
          revenue: toCurrency(value[key].revenuePercent),
          arrOrAgr: toCurrency(value[key].arr),
          arp: toCurrency(value[key].arp),
        });
      });

    return this;
  }
}
