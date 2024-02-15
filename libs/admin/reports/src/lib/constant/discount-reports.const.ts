import { PromoCodeReport } from '../models/discount-reports.models';
import {
  DiscountAllowanceReportData,
  PromoCodeReportData,
} from '../types/discount-reports.types';
import { ColsData } from '../types/reports.types';

export const discountAllowanceReportCols: Partial<ColsData<
  DiscountAllowanceReportData
>> = {
  date: {
    header: 'Date',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  // group: {
  //   header: 'Group',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  // reasonForDiscount: {
  //   header: 'Reason For Discount',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  directDiscount: {
    header: 'Direct Discount',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  // allowance: {
  //   header: 'Allowance',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  // total: {
  //   header: 'Net Total',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
};

export const promoCodeReportCols: ColsData<PromoCodeReportData> = {
  promoCode: {
    header: 'Promo Code',
    isSortDisabled: true,
  },
  discount: {
    header: 'Discount',
    isSortDisabled: true,
  },
  redemptions: {
    header: 'Redemptions',
    isSortDisabled: true,
  },
  totalNights: {
    header: 'Total Nights',
    isSortDisabled: true,
  },
  totalRevenueEarned: {
    header: 'Total Revenue Earned',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};
