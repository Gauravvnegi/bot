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
    isSearchDisabled: true,
  },
  revenue: {
    header: 'Revenue',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const marketSourceReportRows = [
  { name: 'INDIVIDUALS', value: 'INDIVIDUALS' },
  { name: 'EASEMYTRIP', value: 'EASEMYTRIP' },
  { name: 'YATRA', value: 'YATRA' },
  { name: 'subTotal', value: 'subTotal' },
];
