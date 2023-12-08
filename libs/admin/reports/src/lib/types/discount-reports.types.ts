import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { ReservationReportData, User } from './reservation-reports.types';

export type DiscountAllowanceReportData = {
  date: string;
  group: string;
  res: string;
  createdBy: string;
  guestName: string;
  reasonForDiscount: string;
  directDiscount: string;
  allowance: string;
  total: string;
};

export type DiscountAllowanceReportResponse = ReservationResponseData & {
  user: User;
};
