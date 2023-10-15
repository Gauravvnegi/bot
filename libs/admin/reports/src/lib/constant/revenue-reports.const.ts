import { ColsData } from '../types/reports.types';
import { CashierReportData } from '../types/revenue-reports.types';

export const cashierReportCols: ColsData<CashierReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};
