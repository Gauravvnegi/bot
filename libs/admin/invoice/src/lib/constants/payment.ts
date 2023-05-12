import { PaymentField } from '../types/forms.types';

export const cols: {
  field: keyof PaymentField | 'menu';
  header: string;
  width: string;
}[] = [
  {
    field: 'description',
    header: 'Description',
    width: '28%',
  },
  {
    field: 'unit',
    header: 'Unit',
    width: '10%',
  },
  {
    field: 'unitValue',
    header: 'Unit Value',
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
    width: '14%',
  },
  {
    field: 'menu',
    header: '',
    width: '5%',
  },
];
