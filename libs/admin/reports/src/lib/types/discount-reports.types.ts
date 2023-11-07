import { ReservationResponseData } from "libs/admin/shared/src/lib/types/response";
import { ReservationReportData } from "./reservation-reports.types";

export type DiscountAllowanceReportData = {
  date: string;
  group: string;
  res: string;
  createdBy: string;
  guestName: string;
  reasonForDiscount: string;
  directDiscount: number;
  allowance: string;
  total: number;
};

export type DiscountAllowanceReportResponse = ReservationResponseData;