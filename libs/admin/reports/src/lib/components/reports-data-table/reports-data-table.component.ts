import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BaseDatatableComponent,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import {
  GetReportQuery,
  ReportFilters,
  ReportFiltersKey,
  ReportType,
} from '../../types/reports.type';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

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

  selectedReport: ReportType;

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
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.initReportFilters();

    this.reportsService.$selectedReport.subscribe((res) => {
      this.selectedReport = res;
      this.loadInitialData();
    });
  }

  getQueryParams(): GetReportQuery {
    const filters: ReportFilters = this.tableFG.get('filters').value;
    return {
      entityId: this.globalFilterService.entityId,
      toDate: filters.toDate,
      fromDate: filters.fromDate,
      roomType: filters.roomType,
      reportName: this.selectedReport,
    };
  }

  loadInitialData() {
    this.reportsService.getReport(this.getQueryParams()).subscribe((res) => {
      debugger;
    });
    this.loading = true;
  }

  initReportFilters() {
    const filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    } as Record<ReportFiltersKey, any>);

    this.tableFG.addControl('filters', filterForm);
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
