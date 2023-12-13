import { RateVariationReportData } from '../types/rate-package-reports.types';
import { ColsData } from '../types/reports.types';

export const rateVariationReportCols: ColsData<RateVariationReportData> = {
  bookingNo: {
    header: 'Res#',
    isSortDisabled: true,
  },
  folio: {
    header: 'Folio',
    isSortDisabled: true,
  },
  roomType: {
    header: 'Room Type',
    isSortDisabled: true,
  },
  roomNo: {
    header: 'Room No',
    isSortDisabled: true,
  },
  guestName: {
    header: 'Guest Name',
    isSortDisabled: true,
  },
  discountedRate: {
    header: 'Discounted Rate',
    isSortDisabled: true,
  },
  rateVariance: {
    header: 'Rate Variance',
    isSortDisabled: true,
  },
  actualRate: {
    header: 'Actual Rate',
    isSortDisabled: true,
  },
  employee: {
    header: 'Employee',
    isSortDisabled: true,
  },
};
