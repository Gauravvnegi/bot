import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  BaseDatatableComponent,
  Cols,
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
  tableName = 'Arrival Reports';
  cols: Cols[] = [];
  isQuickFilters = true;
  entityId: string;
  globalQueries = [];
  isSelectable = false;
  isSearchable = false;

  @Input() set columnData(value: string[]) {
    this.cols = value.map((item) => ({
      field: '',
      header: item,
      isSortDisabled: true,
    }));
  }

  @Input() set rowData(value: string[][]) {
    this.values = value;
  }

  $subscription = new Subscription();
  constructor(
    private reportsService: ReportsService,
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  loadInitialData() {}

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
