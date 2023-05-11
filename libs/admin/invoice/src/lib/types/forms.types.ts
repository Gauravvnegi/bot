import { Invoice, TableData } from '../models/invoice.model';

export type InvoiceForm = Omit<Invoice, 'deserialize'>;
export type PaymentField = Omit<TableData, 'deserialize'>;
