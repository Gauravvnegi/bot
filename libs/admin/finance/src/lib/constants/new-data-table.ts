import { filtersChips } from '@hospitality-bot/admin/library';
import { Chip, Cols, Filter, FlagType } from '@hospitality-bot/admin/shared';
import { TransactionStatus } from '../types/history';


export const cols = {
  invoice: [
    {
      field: 'pdfUrl',
      header: 'Pdf URL',
      sortType: 'string',
    },
    {
      field: 'isRefund',
      header: 'Refund',
      sortType: 'number',
    },
    {
      field: 'date',
      header: 'Invoice Date',
      isSortDisabled: true,
      isSearchDisabled: true,
    },
    {
      field: 'reservationId',
      header: 'Reservation Id',
      sortType: 'number',
    },
  ],

}
export const title = 'New Data History';