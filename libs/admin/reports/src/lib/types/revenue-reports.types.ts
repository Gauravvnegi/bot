import { Cashier } from '../models/revenue-reports.models';
import { RowStylesKeys } from './reports.types';

export type CashierReportData = Omit<Cashier, 'deserialize' | RowStylesKeys>;

export type CashierReportResponse = {
  paymentMode: string;
  totalAmount: number;
};
