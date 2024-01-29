import { ProductNames } from "@hospitality-bot/admin/shared";


type ProductModule = keyof typeof ProductNames
    
export type ReportMenu = {
  label: string;
  value: string;
  product: ProductModule[];
  active: boolean;
  priority: number;
  serviceFactory: string;
};

export type ReportCategory = {
  menu: ReportMenu[];
}

export type ReportConfigResponse = {
  RESERVATION_REPORTS: ReportCategory;
  MANAGER_REPORTS: ReportCategory;
  OCCUPANCY_REPORTS: ReportCategory;
  REVENUE_REPORTS: ReportCategory;
  FINANCIAL_REPORTS: ReportCategory;
  NIGHT_AUDIT_REPORTS: ReportCategory;
  TAX_REPORTS: ReportCategory;
  GUEST_REPORTS: ReportCategory;
  ACTIVITY_REPORTS: ReportCategory;
  ANALYTICS_REPORTS: ReportCategory;
  DISCOUNT_REPORTS: ReportCategory;
  DIRECT_BILLING_REPORTS: ReportCategory;
  SOURCE_REPORTS: ReportCategory;
  FOLIO_REPORTS: ReportCategory;
  RATE_PACKAGE_REPORTS: ReportCategory;
}
