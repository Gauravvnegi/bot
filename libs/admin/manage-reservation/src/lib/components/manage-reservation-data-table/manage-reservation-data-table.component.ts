import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent as BaseDatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  chips,
  cols,
  filters,
  ReservationSearchItem,
  reservationStatus,
  ReservationStatusType,
  ReservationTableValue,
  title,
} from '../../constants/reservation-table';
import { manageReservationRoutes } from '../../constants/routes';
import { ReservationList } from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  ReservationListResponse,
  ReservationResponse,
} from '../../types/response.type';

@Component({
  selector: 'hospitality-bot-manage-reservation-data-table',
  templateUrl: './manage-reservation-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './manage-reservation-data-table.component.scss',
  ],
})
export class ManageReservationDataTableComponent extends BaseDatableComponent {
  readonly manageReservationRoutes = manageReservationRoutes;
  hotelId!: string;
  tabFilterItems = filters;
  statusValues = reservationStatus;
  selectedTable: ReservationTableValue;
  tableName = title;
  filterChips = chips;
  cols = cols;
  isQuickFilters = true;
  reservationLists!: ReservationList;
  $subscription = new Subscription();
  globalQueries = [];

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private manageReservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.listenToTableChange();
    });
  }

  /**
   * @function listenToTableChange  To listen to table changes
   */
  listenToTableChange() {
    this.manageReservationService.selectedTable.subscribe((value) => {
      this.selectedTable = value;
      this.initTableValue();
    });
  }

  /**
   * @function initTableValue initializing data into value of table
   */
  initTableValue() {
    this.loading = true;
    this.manageReservationService
      .getReservationItems<ReservationListResponse>(this.getQueryConfig())
      .subscribe(
        (res) => {
          this.reservationLists = new ReservationList().deserialize(res);
          this.values = this.reservationLists.reservationData;
          this.totalRecords = this.reservationLists.total;
          this.filterChips.forEach((item) => {
            item.total = this.reservationLists.entityStateCounts[item.value];
          });
        },
        this.handleError,
        this.handleFinal
      );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: ReservationStatusType, reservationData): void {
    this.loading = true;
    this.$subscription.add(
      this.manageReservationService
        .updateBookingStatus(reservationData.id, this.hotelId, {
          reservationType: status,
        })
        .subscribe(
          (res) => {
            this.values.find(
              (item) => item.id === reservationData.id
            ).status = status;
            this.snackbarService.openSnackBarAsText(
              'Booking ' + status + ' changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.filterChips.filter(
      (item) => item?.isSelected && item?.value !== 'ALL'
    );
    let chipsValue = chips.map((item) => item?.value);
    return [{ entityState: chipsValue }];
  }

  /**
   * @function editReservation To navigate at edit page
   */
  editReservation(id: string) {
    this.router.navigate([
      `/pages/efrontdesk/manage-reservation/${manageReservationRoutes.editReservation.route}/${id}`,
    ]);
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFilters(),
        {
          type: ReservationSearchItem.ROOM_TYPE,
          entityType: this.selectedTable,
          entityId: this.hotelId,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.selectedTable = this.tabFilterItems[event.index].value;
    this.manageReservationService
      .getReservationItemsByCategory<ReservationListResponse>(
        this.getQueryConfig()
      )
      .subscribe(
        (res) => {
          this.reservationLists = new ReservationList().deserialize(res);
          this.values = this.reservationLists.reservationData;
          this.totalRecords = this.reservationLists.total;
          this.filterChips.forEach((item) => {
            item.total = this.reservationLists.entityStateCounts[item.value];
          });
        },
        this.handleError,
        this.handleFinal
      );
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: LibraryItem.service },
      ]),
    };
    this.$subscription.add(
      this.manageReservationService.exportCSV(this.hotelId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        this.handleError,
        this.handleFinal
      )
    );
  }

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
