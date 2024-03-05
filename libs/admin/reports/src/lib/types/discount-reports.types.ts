import { ReservationResponseData } from 'libs/admin/shared/src/lib/types/response';
import { User } from './reservation-reports.types';

export type AllowanceReportData = Omit<
  DiscountAllowanceReportData,
  'directDiscount'
> & { allowance: string };

export type AllowanceReportResponse = DiscountAllowanceReportResponse & {};

export type DiscountAllowanceReportData = {
  reservationId: string;
  date: string;
  group: string;
  res: string;
  createdBy: string;
  guestName: string;
  reasonForDiscount: string;
  directDiscount: string;
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
