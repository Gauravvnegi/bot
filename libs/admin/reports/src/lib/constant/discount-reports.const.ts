import { PromoCodeReport } from '../models/discount-reports.models';
import {
  AllowanceReportData,
  DiscountAllowanceReportData,
  PromoCodeReportData,
} from '../types/discount-reports.types';
import { ColsData } from '../types/reports.types';

export const allowanceReportCols: Partial<ColsData<AllowanceReportData>> = {
  date: {
    header: 'Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },

  allowance: {
    header: 'Allowance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
export const discountAllowanceReportCols: Partial<ColsData<
  DiscountAllowanceReportData
>> = {
  date: {
    header: 'Date',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // group: {
  //   header: 'Group',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  res: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  // reasonForDiscount: {
  //   header: 'Reason For Discount',
  //   isSortDisabled: true,
  //   isSearchDisabled: true,
  // },
  directDiscount: {
    header: 'Direct Discount',
    isSortDisabled: true,
    isSearchDisabled: false,
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
    isSearchDisabled: false,
  },
  discount: {
    header: 'Discount',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  redemptions: {
    header: 'Redemptions',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalNights: {
    header: 'Total Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalRevenueEarned: {
    header: 'Total Revenue Earned',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
