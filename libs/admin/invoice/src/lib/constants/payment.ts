import { BillItemFields } from '../types/forms.types';

export const cols: {
  field: keyof BillItemFields | 'menu';
  header: string;
  width: string;
}[] = [
  {
    field: 'date',
    header: 'Date',
    width: '20%',
  },
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
    field: 'debitAmount',
    header: 'Debit',
    width: '15%',
  },
  {
    field: 'creditAmount',
    header: 'Credit',
    width: '15%',
  },
  {
    field: 'menu',
    header: '',
    width: '5%',
  },
];

const data = '[123-123] Chill Room';
