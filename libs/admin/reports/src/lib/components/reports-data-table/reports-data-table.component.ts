import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'hospitality-bot-reports-data-table',
  templateUrl: './reports-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './reports-data-table.component.scss',
  ],
})
export class ReportsDataTableComponent extends BaseDatatableComponent {
  tableName = 'asd';
  cols = [
    {
      field: 'invoiceId',
      header: 'Invoice Id',
      sortType: 'string',
    },
    {
      field: 'bookingNumber',
      header: 'Booking No.',
      sortType: 'number',
    },
    {
      field: 'date',
      header: 'Invoice Date',
      isSortDisabled: true,
      isSearchDisabled: true,
    },
    {
      field: 'totalBill',
      header: 'Total Bill',
      sortType: 'number',
    },
  ];
  isQuickFilters = true;
  entityId: string;
  globalQueries = [];
  isSelectable = false;

  $subscription = new Subscription();
  constructor(
    private reportsService: ReportsService,
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
