import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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

    this.reportsService.$selectedReport.subscribe((report) => {
      if (report) {
        this.selectedReport = report;
        this.loadInitialData();
      }
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
    this.loading = true;

    this.reportsService.getReport(this.getQueryParams()).subscribe(
      (res) => {
        debugger;
      },
      () => {},
      () => {
        this.loading = false;
      }
    );
  }

  initReportFilters() {
    const filterForm = this.fb.group({
      // fromDate: [new Date().getTime()],
      // toDate: [new Date().getTime()],
      fromDate: [1696962600000],
      toDate: [1697048999000],
      roomType: [''],
    } as Record<ReportFiltersKey, any>);
    this.tableFG.addControl('filters', filterForm);

    filterForm.valueChanges.subscribe((_res) => {
      this.loadInitialData();
    });
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
