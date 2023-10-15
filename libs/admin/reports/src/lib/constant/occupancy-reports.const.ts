import { HistoryAndForecastReportData } from '../types/occupany-reports.types';
import { ColsData } from '../types/reports.types';

export const historyAndForecastReportCols: ColsData<HistoryAndForecastReportData> = {
  // ToDO
  bookingNo: {
    header: 'Res/Group',
  },
  dateOfArrival: {
    header: 'Date of Arrival',
  },
};
