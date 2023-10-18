import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BaseDatatableComponent,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import {
  reportFiltersMapping,
  reportsColumnMapping,
  reportsModelMapping,
  rowStylesMapping,
} from '../../constant/reports.const';
import { ReportsService } from '../../services/reports.service';
import {
  GetReportQuery,
  ReportFilters,
  ReportFiltersKey,
  ReportsMenu,
  RowStyles,
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
  fromDate: Date;
  toDate: Date;
  minDate = new Date();

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
    this.initTime();
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
      reportName: this.selectedReport.value,
      ...this.currentFilters.reduce((value, curr) => {
        if (curr === 'month') {
          const startDate = new Date(filters.month);
          if (startDate instanceof Date) {
            const lastDay = new Date(
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              0
            );

            const rangeQuery: Partial<Record<ReportFiltersKey, number>> = {
              fromDate: startDate.getTime(),
              toDate: lastDay.getTime(),
            };

            value = {
              ...value,
              ...rangeQuery,
            };
          }
        } else if (curr == 'date') {
          this.initTime({
            fromDate: filters['fromDate'],
            toDate: filters['fromDate'],
          });
          value = {
            ...value,
            fromDate: this.fromDate.getTime(),
            toDate: this.toDate.getTime(),
          };
        } else {
          value = {
            ...value,
            [curr]: filters[curr],
          };
        }

        return value;
      }, {}),
    };
  }

  loadInitialData() {
    this.loading = true;
    const query = this.getQueryParams();

    this.reportsService.getReport(query).subscribe(
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
      fromDate: [this.fromDate?.getTime() || null],
      toDate: [this.toDate?.getTime() || null],
      roomType: [''],
      month: [new Date().setDate(1) || null],
    } as Record<ReportFiltersKey, any>);
    this.tableFG.addControl('filters', filterForm);
    filterForm.valueChanges.subscribe((_res) => {
      this.minDate = new Date(_res.fromDate);
      this.initTime(_res);
      this.loadInitialData();
    });
  }

  initTime(res?: { fromDate: number; toDate: number }) {
    this.fromDate = new Date(res ? res.fromDate : Date.now());
    this.toDate = new Date(res ? res.toDate : Date.now());
    this.fromDate.setHours(0, 0, 0, 0);
    this.toDate.setHours(23, 59, 59, 999);
    if (res) {
      this.tableFG.controls['filters'].patchValue(
        {
          fromDate: this.fromDate.getTime(),
          toDate: this.toDate.getTime(),
        },
        { emitEvent: false }
      );
    }
  }

  getStyle(data: RowStyles | Record<string, string | number>) {
    const styleKeys = Object.keys(rowStylesMapping);
    let styleClass = '';
    Object.keys(data).forEach((key) => {
      const foundedStyleClass = styleKeys.includes(key);
      styleClass = `${styleClass} ${
        foundedStyleClass && data[key] == true ? rowStylesMapping[key] : ''
      }`;
    });
    return styleClass.trim();
  }

  get availableFilters() {
    return {
      isFromDate: this.currentFilters.includes('fromDate'),
      isToDate: this.currentFilters.includes('toDate'),
      isRoomType: this.currentFilters.includes('roomType'),
      isMonth: this.currentFilters.includes('month'),
      isDate: this.currentFilters.includes('date'),
    };
  }

  get currentFilters() {
    return reportFiltersMapping[this.selectedReport.value];
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
