import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Cols,
  Option,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import {
  reportFiltersMapping,
  reportsColumnMapping,
  reportsModelMapping,
  reservationReportsMenu,
  rowStylesMapping,
} from '../../constant/reports.const';
import { ReportsService } from '../../services/reports.service';
import {
  GetReportQuery,
  ReportFilters,
  ReportFiltersKey,
  ReportsMenu,
  ReportsType,
  RowStyles,
} from '../../types/reports.types';
import {
  DetailsComponent,
  DetailsTabOptions,
} from '@hospitality-bot/admin/reservation';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';

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
  minDate = new Date();
  userList: Option[] = [
    {
      label: 'All',
      value: '',
    },
  ];

  selectedReport: ReportsMenu[number];

  $subscription = new Subscription();
  constructor(
    private reportsService: ReportsService,
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private modalService: ModalService,
    private managePermissionService: ManagePermissionService,
    private adminUtilityService: AdminUtilityService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initTime();
    this.initReportFilters();
    this.getUserList();
    this.reportsService.$selectedReport.subscribe((report) => {
      if (report) {
        this.selectedReport = report;
        this.loadInitialData();
      }
    });
  }
  userOffset: number = 0;
  noMoreUsers: boolean = false;
  loadMoreUsers() {
    this.userOffset = this.userOffset + 10;
    this.getUserList();
  }

  getUserList() {
    this.$subscription.add(
      this.managePermissionService
        .getAllUsers(this.entityId, {
          params: this.adminUtilityService.makeQueryParams([
            {
              offset: this.userOffset,
              limit: 10,
            },
          ]),
        })
        .subscribe((res) => {
          const data = res.records.map((item) => ({
            label: item.firstName + ' ' + item.lastName,
            value: item.id,
          }));

          this.userList = [...this.userList, ...data];

          this.noMoreUsers = data.length < 10;
        })
    );
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

            const rangeQuery: Partial<Record<
              ReportFiltersKey,
              number
            >> = this.getModifiedDate({
              fromDate: startDate.getTime(),
              toDate: lastDay.getTime(),
            });

            value = {
              ...value,
              ...rangeQuery,
            };
          }
        } else if (curr == 'date') {
          const { fromDate, toDate } = this.getModifiedDate({
            fromDate: +filters['date'],
            toDate: +filters['date'],
          });
          value = {
            ...value,
            fromDate: fromDate,
            toDate: toDate,
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
        if (this.selectedReport.value === 'managerFlashReport') {
          const date = this.tableFG.controls['filters'].get('date').value;
          this.addAdditionalTextToCols(new Date(date).getFullYear().toString());
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.values = [];
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
    const { fromDate, toDate } = this.getModifiedDate();
    const filterForm = this.fb.group({
      fromDate: [fromDate || null],
      toDate: [toDate || null],
      date: [fromDate || null],
      roomType: [''],
      month: [new Date().setDate(1) || null],
      cashierId: [''],
      employeeId: [''],
    } as Record<ReportFiltersKey, any>);
    this.tableFG.addControl('filters', filterForm);

    filterForm.valueChanges.subscribe((res) => {
      this.minDate = new Date(res.fromDate);
      this.initTime(res);
      this.loadInitialData();
    });
  }

  initTime(res?: { fromDate: number; toDate: number }) {
    const { fromDate, toDate } = this.getModifiedDate(res);
    if (res) {
      this.tableFG.controls['filters'].patchValue(
        {
          fromDate: fromDate,
          toDate: toDate,
        },
        { emitEvent: false }
      );
    }
  }

  getModifiedDate(date?: { fromDate: number; toDate: number }) {
    const fromDate = new Date(date ? date.fromDate : Date.now());
    const toDate = new Date(date ? date.toDate : Date.now());
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    return {
      fromDate: fromDate.getTime(),
      toDate: toDate.getTime(),
    };
  }

  addAdditionalTextToCols(text: string) {
    this.cols = this.cols.map((item) => ({
      ...item,
      header: item?.header?.length ? `${item.header} ${text}` : '',
    }));
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

  onRowClick(data) {
    if (
      reservationReportsMenu.includes(
        this.selectedReport.value as ReportsType['RESERVATION_REPORTS']
      )
    ) {
      this.openDetailPage(data);
    }
  }

  openDetailPage(rowData, tabKey?: DetailsTabOptions): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.bookingId = rowData?.id;

    tabKey && (detailCompRef.componentInstance.tabKey = tabKey);

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((_) => {
        detailCompRef.close();
      })
    );
  }

  get availableFilters() {
    return {
      isFromDate: this.currentFilters.includes('fromDate'),
      isToDate: this.currentFilters.includes('toDate'),
      isRoomType: this.currentFilters.includes('roomType'),
      isMonth: this.currentFilters.includes('month'),
      isDate: this.currentFilters.includes('date'),
      isCashier: this.currentFilters.includes('cashierId'),
      isEmployee: this.currentFilters.includes('employeeId'),
    };
  }

  get currentFilters() {
    return reportFiltersMapping[this.selectedReport.value];
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }
}
