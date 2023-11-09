import { ColsData } from '../types/reports.types';
import { MarketSourceReportData } from '../types/scource-reports.types';

export const marketSourceReportCols: ColsData<MarketSourceReportData> = {
  company: {
    header: 'Company',
    isSortDisabled: true,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
  },
  occupancy: {
    header: 'Occupancy',
    isSortDisabled: true,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
  },
  revenue: {
    header: 'Revenue',
    isSortDisabled: true,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
  },
};

export const marketSourceReportRows = [
  { name: 'INDIVIDUALS', value: 'INDIVIDUALS' },
  { name: 'EASEMYTRIP', value: 'EASEMYTRIP' },
  { name: 'YATRA', value: 'YATRA' },
  { name: 'subTotal', value: 'subTotal' },
];
