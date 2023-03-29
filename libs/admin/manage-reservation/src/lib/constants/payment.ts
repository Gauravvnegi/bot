import { PaymentField } from '../types/forms.types';

export const cols: {
  field: keyof PaymentField;
  header: string;
  width: string;
}[] = [
  {
    field: 'description',
    header: 'Description',
    width: '30%',
  },
  {
    field: 'unit',
    header: 'Unit',
    width: '10%',
  },
  {
    field: 'unitPrice',
    header: 'Unit Price',
    width: '10%',
  },
  {
    field: 'amount',
    header: 'Amount',
    width: '10%',
  },
  {
    field: 'tax',
    header: 'Tax',
    width: '20%',
  },
  {
    field: 'totalAmount',
    header: 'TotalAmount',
    width: '15%',
  },
];
