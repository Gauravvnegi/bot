import {
  CategoryWiseComplaintReportData,
  ServiceItemWiseComplaintReportData,
} from '../types/complaint-report.types';
import { ColsData } from '../types/reports.types';

export const serviceItemWiseComplaintReportCols: ColsData<ServiceItemWiseComplaintReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  category: {
    header: 'Category',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  sla: {
    header: 'SLA',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalComplaints: {
    header: 'Total Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  unResolvedComplaints: {
    header: 'Unresolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  resolvedComplaints: {
    header: 'Resolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  cancelledComplaints: {
    header: 'Cancelled Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  escalatedComplaints: {
    header: 'Escalated Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};

export const categoryWiseComplaintReportCols: ColsData<CategoryWiseComplaintReportData> = {
  category: {
    header: 'Category Name',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalServiceItems: {
    header: 'Total Service Items',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  totalComplaints: {
    header: 'Total Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  unResolvedComplaints: {
    header: 'Unresolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  resolvedComplaints: {
    header: 'Resolved Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  cancelledComplaints: {
    header: 'Cancelled Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
  escalatedComplaints: {
    header: 'Escalated Complaints',
    isSortDisabled: true,
    isSearchDisabled: true,
  },
};
