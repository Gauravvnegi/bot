import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { User } from './reservation-reports.types';

export type RateVariationReportData = {
  bookingNo: string;
  folio: string;
  roomType: string;
  roomNo: string;
  guestName: string;
  discountedRate: string;
  rateVariance: string;
  actualRate: string;
  employee: string;
};

export type RateVariationReportResponse = ReservationResponseData & {
  invoiceCode: string;
  user: User;
};
