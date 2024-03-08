import {
  OrderSummaryReportData,
  OrderSummaryReportResponse,
} from '../types/order-reports.types';
import { ReportClass } from '../types/reports.types';

export class OrderSummaryReport
  implements ReportClass<OrderSummaryReportData, OrderSummaryReportResponse> {
  records: OrderSummaryReportData[];

  deserialize(value: {} | OrderSummaryReportResponse[]): this {
    return this;
  }
}
