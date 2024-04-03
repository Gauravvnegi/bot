import { RateVariationReportData } from '../types/rate-package-reports.types';
import { ColsData } from '../types/reports.types';

export const rateVariationReportCols: ColsData<RateVariationReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  folio: {
    header: 'Folio',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomNo: {
    header: 'Room No',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  discountedRate: {
    header: 'Discounted Rate',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  rateVariance: {
    header: 'Rate Variance',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  actualRate: {
    header: 'Actual Rate',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  employee: {
    header: 'Employee',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
