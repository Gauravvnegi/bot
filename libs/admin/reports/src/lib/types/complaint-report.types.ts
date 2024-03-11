export type ServiceItemWiseComplaintReportData = {
  name: string;
  category: string;
  sla: number;
  totalComplaints: number;
  unResolvedComplaints: number;
  resolvedComplaints: number;
  cancelledComplaints: number;
  escalatedComplaints: number;
};

export type ServiceItemWiseComplaintReportResponse = {
  records: {
    id: string;
    itemName: string;
    entityId: string;
    category: {
      id: string;
      name: string;
      totalServiceItems: number;
    };
    complaintRequestStats: ComplaintRequestStats;
    sla: number;
  }[];
};

type ComplaintRequestStats = {
  total: number;
  closedJobs: number;
  openJobs: number;
  cancelledJobs: number;
  escalatedJobs: number;
};

export type CategoryWiseComplaintReportData = {
  category: string;
  totalServiceItems: number;
  totalComplaints: number;
  unResolvedComplaints: number;
  resolvedComplaints: number;
  cancelledComplaints: number;
  escalatedComplaints: number;
};

export type CategoryWiseComplaintReportResponse = {
  records: {
    id: string;
    name: string;
    totalServiceItems: number;
    complaintRequestStats: ComplaintRequestStats;
  }[];
};
