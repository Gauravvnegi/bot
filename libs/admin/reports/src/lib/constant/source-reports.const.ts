import { ColsData } from '../types/reports.types';
import { MarketSourceReportData } from '../types/scource-reports.types';

export const marketSourceReportCols: ColsData<MarketSourceReportData> = {
  company: {
    header: 'Company',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  nights: {
    header: 'Nights',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  occupancy: {
    header: 'Occupancy',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  pax: {
    header: 'Pax',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  roomRevenue: {
    header: 'Room Revenue',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  revenue: {
    header: 'Revenue',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arrOrAgr: {
    header: 'ARR/AGR',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  arp: {
    header: 'ARP',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const marketSourceReportRows = [
  { name: 'INDIVIDUALS', value: 'INDIVIDUALS' },
  { name: 'EASEMYTRIP', value: 'EASEMYTRIP' },
  { name: 'YATRA', value: 'YATRA' },
  { name: 'subTotal', value: 'subTotal' },
];
