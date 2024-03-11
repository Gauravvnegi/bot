import {
  CategoryWiseComplaintReportData,
  CategoryWiseComplaintReportResponse,
  ServiceItemWiseComplaintReportData,
  ServiceItemWiseComplaintReportResponse,
} from '../types/complaint-report.types';
import { ReportClass } from '../types/reports.types';

export class ServiceItemWiseComplaintReport
  implements
    ReportClass<
      ServiceItemWiseComplaintReportData,
      ServiceItemWiseComplaintReportResponse
    > {
  records: ServiceItemWiseComplaintReportData[];

  deserialize(value: ServiceItemWiseComplaintReportResponse): this {
    this.records = new Array<ServiceItemWiseComplaintReportData>();

    this.records =
      value?.records?.length &&
      value.records?.map((item) => {
        return {
          name: item?.itemName,
          sla: item?.sla,
          totalComplaints: item?.complaintRequestStats?.total,
          unResolvedComplaints: item?.complaintRequestStats?.openJobs,
          resolvedComplaints: item?.complaintRequestStats?.closedJobs,
          cancelledComplaints: item?.complaintRequestStats?.cancelledJobs,
          escalatedComplaints: item?.complaintRequestStats?.escalatedJobs,
          category: item.category.name,
        };
      });
    return this;
  }
}

export class CategoryWiseComplaintReport
  implements
    ReportClass<
      CategoryWiseComplaintReportData,
      CategoryWiseComplaintReportResponse
    > {
  records: CategoryWiseComplaintReportData[];

  deserialize(value: CategoryWiseComplaintReportResponse): this {
    this.records = new Array<CategoryWiseComplaintReportData>();

    this.records = value?.records?.map((item) => {
      return {
        category: item?.name,
        totalServiceItems: item?.totalServiceItems,
        complaintRequestStats: item?.complaintRequestStats,
        cancelledComplaints: item?.complaintRequestStats?.cancelledJobs,
        unResolvedComplaints: item?.complaintRequestStats?.openJobs,
        resolvedComplaints: item?.complaintRequestStats?.closedJobs,
        escalatedComplaints: item?.complaintRequestStats?.escalatedJobs,
        totalComplaints: item?.complaintRequestStats?.total,
      };
    });

    return this;
  }
}
