import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BaseDatatableComponent,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import {
  reportsColumnMapping,
  reportsModelMapping,
} from '../../constant/reports.const';
import { ReportsService } from '../../services/reports.service';
import {
  GetReportQuery,
  ReportFilters,
  ReportFiltersKey,
  ReportsMenu,
} from '../../types/reports.types';

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

  selectedReport: ReportsMenu[number];

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
      reportName: this.selectedReport.value,
    };
  }

  loadInitialData() {
    this.loading = true;

    this.reportsService.getReport(this.getQueryParams()).subscribe(
      (res) => {
        const ReportModel = reportsModelMapping[this.selectedReport.value];
        this.cols = reportsColumnMapping[this.selectedReport.value];
        this.values = new ReportModel().deserialize(res).records;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  exportCSV(): void {
    this.reportsService
      .getReport(this.getQueryParams(), true)
      .subscribe((res) => {
        FileSaver.saveAs(res, 'Report_export' + new Date().getTime() + '.csv');
      });
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
