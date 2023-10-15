import { ManagerFlashReportData } from '../types/manager-reports.types';
import { ColsData } from '../types/reports.types';

export const managerFlashReportCols: ColsData<ManagerFlashReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};
