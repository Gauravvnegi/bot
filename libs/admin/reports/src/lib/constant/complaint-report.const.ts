import {
  CategoryWiseComplaintReportData,
  ServiceItemWiseComplaintReportData,
} from '../types/complaint-report.types';
import { ColsData } from '../types/reports.types';

export const serviceItemWiseComplaintReportCols: ColsData<ServiceItemWiseComplaintReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  category: {
    header: 'Category',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  sla: {
    header: 'SLA',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalComplaints: {
    header: 'Total Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  unResolvedComplaints: {
    header: 'Unresolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  resolvedComplaints: {
    header: 'Resolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cancelledComplaints: {
    header: 'Cancelled Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  escalatedComplaints: {
    header: 'Escalated Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};

export const categoryWiseComplaintReportCols: ColsData<CategoryWiseComplaintReportData> = {
  category: {
    header: 'Category Name',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalServiceItems: {
    header: 'Total Service Items',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  totalComplaints: {
    header: 'Total Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  unResolvedComplaints: {
    header: 'Unresolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  resolvedComplaints: {
    header: 'Resolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  cancelledComplaints: {
    header: 'Cancelled Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
  escalatedComplaints: {
    header: 'Escalated Complaints',
    isSortDisabled: true,
    isSearchDisabled: false,
  },
};
