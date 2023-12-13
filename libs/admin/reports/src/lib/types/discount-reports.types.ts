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

export type PromoCodeReportData = {
  promoCode: string;
  discount: string;
  redemptions: string;
  totalNights: number;
  totalRevenueEarned: string;
};

export type PromoCodeReportResponse = ReservationResponseData & {
  offer: {
    id: string;
    discountedPrice: number;
    offerType: string;
    offerDiscount: string;
    active: boolean;
    rate: number;
    packageCode: string;
  };
};
