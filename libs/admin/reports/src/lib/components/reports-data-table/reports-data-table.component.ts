import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService, RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { DetailsTabOptions } from '@hospitality-bot/admin/reservation';
import {
    AdminUtilityService,
    BaseDatatableComponent,
    BookingDetailService,
    Cols,
    ModuleNames,
    Option
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';
import { Subject, Subscription } from 'rxjs';
import {
    reportFiltersMapping,
    reportsColumnMapping,
    reportsModelMapping,
    rowStylesMapping
} from '../../constant/reports.const';
import { ReportsService } from '../../services/reports.service';
import { GetReportQuery, ReportFilters, ReportFiltersKey, ReportsMenu, RowStyles } from '../../types/reports.types';
import { distinctUntilChanged, takeUntil, shareReplay } from 'rxjs/operators';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';

@Component({
    selector: 'hospitality-bot-reports-data-table',
    templateUrl: './reports-data-table.component.html',
    styleUrls: [
        '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
        './reports-data-table.component.scss'
    ]
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
    maxDate = new Date();
    userList: Option[] = [
        {
            label: 'All',
            value: ''
        }
    ];
    userOffset: number = 0;
    noMoreUsers: boolean = false;

    selectedReport: ReportsMenu[number];
    $subscription = new Subscription();
    private cancelRequests$ = new Subject<void>();
    constructor(
        private reportsService: ReportsService,
        public fb: FormBuilder,
        private globalFilterService: GlobalFilterService,
        private managePermissionService: ManagePermissionService,
        private adminUtilityService: AdminUtilityService,
        public bookingDetailService: BookingDetailService,
        private notificationService: NotificationService,
        private routesConfigService: RoutesConfigService
    ) {
        super(fb);
    }

    ngOnInit(): void {
        this.entityId = this.globalFilterService.entityId;
        this.initTime();
        this.initReportFilters();
        this.$subscription.add(
            this.reportsService.$selectedReport.pipe(distinctUntilChanged(), shareReplay(1)).subscribe(
                (report) => {
                    if (report) {
                        this.selectedReport = report;
                        this.cancelRequests$.next();
                        this.loadInitialData();
                        if (this.currentFilters?.includes('employeeId') || this.currentFilters?.includes('cashierId')) {
                            this.getUserList();
                        }
                    }
                },
                ({ error }) => {}
            )
        );
    }

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
                            limit: 10
                        }
                    ])
                })
                .subscribe((res) => {
                    const data = res.records.map((item) => ({
                        label: item.firstName + ' ' + item.lastName,
                        value: item.id
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
            ...this.currentFilters?.reduce((value, curr) => {
                if (curr === 'month') {
                    const startDate = new Date(filters.month);
                    if (startDate instanceof Date) {
                        const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

                        const rangeQuery: Partial<Record<ReportFiltersKey, number>> = this.getModifiedDate({
                            fromDate: startDate.getTime(),
                            toDate: lastDay.getTime()
                        });

                        value = {
                            ...value,
                            ...rangeQuery
                        };
                    }
                } else if (curr == 'date') {
                    const { fromDate, toDate } = this.getModifiedDate({
                        fromDate: +filters['date'],
                        toDate: +filters['date']
                    });
                    value = {
                        ...value,
                        fromDate: fromDate,
                        toDate: toDate
                    };
                } else {
                    value = {
                        ...value,
                        [curr]: filters[curr]
                    };
                }

                return value;
            }, {})
        };
    }

    loadInitialData() {
        this.loading = true;
        const query = this.getQueryParams();

        this.reportsService
            .getReport(query)
            .pipe(
                //to cancel api call between using take until
                takeUntil(this.cancelRequests$)
            )
            .subscribe(
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
        this.reportsService.getReport(this.getQueryParams(), true).subscribe((res) => {
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
            employeeId: ['']
        } as Record<ReportFiltersKey, any>);
        this.tableFG.addControl('filters', filterForm);

        filterForm.valueChanges.subscribe((res) => {
            this.minDate = new Date(res.fromDate);
            this.maxDate = new Date(res?.toDate);
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
                    toDate: toDate
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
            toDate: toDate.getTime()
        };
    }

    addAdditionalTextToCols(text: string) {
        this.cols = this.cols.map((item) => ({
            ...item,
            header: item?.header?.length ? `${item.header} ${text}` : ''
        }));
    }

    getStyle(data: RowStyles | Record<string, string | number>) {
        const styleKeys = Object.keys(rowStylesMapping);
        let styleClass = '';
        Object.keys(data).forEach((key) => {
            const foundedStyleClass = styleKeys.includes(key);
            styleClass = `${styleClass} ${foundedStyleClass && data[key] == true ? rowStylesMapping[key] : ''}`;
        });
        return styleClass.trim();
    }

    onRowClick(data) {
        if (data?.reservationId || data?.guestId) {
            this.bookingDetailService.openBookingDetailSidebar({
                ...(data.reservationId && { bookingId: data.reservationId }),
                ...(data.guestId && { guestId: data.guestId }),
                ...(data.tabKey && { tabKey: data.tabKey })
            });
        } else if (data?.complaintId) {
            this.notificationService.$requestNotification.next(data.complaintId);
            this.routesConfigService.navigate({
                subModuleName: ModuleNames.COMPLAINTS
            });
        }
    }

    get availableFilters() {
        return {
            isFromDate: this.currentFilters?.includes('fromDate'),
            isToDate: this.currentFilters?.includes('toDate'),
            isRoomType: this.currentFilters?.includes('roomType'),
            isMonth: this.currentFilters?.includes('month'),
            isDate: this.currentFilters?.includes('date'),
            isCashier: this.currentFilters?.includes('cashierId'),
            isEmployee: this.currentFilters?.includes('employeeId')
        };
    }

    get currentFilters() {
        return reportFiltersMapping[this.selectedReport?.value];
    }

    toggleMenu() {
        this.reportsService.toggleMenu();
    }

    ngOnDestroy(): void {
        this.$subscription.unsubscribe();
    }
}
