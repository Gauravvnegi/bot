import { filtersChips } from '@hospitality-bot/admin/library';
import { Cols, Filter } from '@hospitality-bot/admin/shared';

export enum TableValue {
  COMPANY = 'COMPANY',
  AGENT = 'AGENT',
}

export const filters: Filter<TableValue, string>[] = [
  {
    label: 'Company',
    value: TableValue.COMPANY,
    content: '',
    disabled: false,
    total: 0,
  },
  {
    label: 'AGENT',
    value: TableValue.AGENT,
    content: '',
    disabled: false,
    total: 0,
  },
];

export const cols: Record<TableValue, Cols[]> = {
  [TableValue.AGENT]: [
    {
      field: 'agentCode',
      header: 'Agent Code',
      sortType: 'number',
    },
    {
      field: 'agentName',
      header: 'Agent Name',
      sortType: 'string',
    },
    {
      field: 'email',
      header: 'Email',
      sortType: 'string',
    },
    {
      field: 'phone',
      header: 'Phone No',
      sortType: 'string',
    },
    {
      field: 'commision',
      header: 'Commision',
      sortType: 'number',
    },
    {
      field: 'status',
      header: 'Action/Status',
      sortType: 'string',
      isSearchDisabled: true,
    },
  ],
  [TableValue.COMPANY]: [
    {
      field: 'companyCode',
      header: 'Company Code',
      sortType: 'number',
    },
    {
      field: 'contactName',
      header: 'Contact Name',
      sortType: 'string',
    },
    {
      field: 'email',
      header: 'Email',
      sortType: 'string',
    },
    {
      field: 'phone',
      header: 'Phone No',
      sortType: 'string',
    },
    {
      field: 'salesPersonName',
      header: 'Sales Perosn Name',
      sortType: 'string',
    },
    {
      field: 'salesPersonNumber',
      header: 'Sales Person No.',
      sortType: 'string',
    },
    {
      field: 'commision',
      header: 'Commision',
      sortType: 'number',
    },
    {
      field: 'status',
      header: 'Action/Status',
      sortType: 'string',
      isSearchDisabled: true,
    },
  ],
};

export const title = 'Booking Source';

export const chips = filtersChips.map((item) => ({ ...item }));
