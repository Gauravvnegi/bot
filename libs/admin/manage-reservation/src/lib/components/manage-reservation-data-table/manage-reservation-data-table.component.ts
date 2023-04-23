import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent as BaseDatableComponent,
  ConfigService,
  TableService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import {
  chips,
  cols,
  filters,
  ReservationSearchItem,
  ReservationStatusType,
  title,
} from '../../constants/reservation-table';
import { manageReservationRoutes } from '../../constants/routes';
import {
  BookingConfig,
  ReservationList,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationListResponse } from '../../types/response.type';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { MatDialogConfig } from '@angular/material/dialog';

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
  selectedTable;
  tableName = title;
  filterChips = chips;
  cols = cols;
  isQuickFilters = true;
  reservationLists!: ReservationList;
  $subscription = new Subscription();
  globalQueries = [];
  configData: BookingConfig;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private manageReservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private configService: ConfigService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getConfigData();
    this.listenForGlobalFilters();
  }

  getConfigData(): void {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );

        const data = this.configData.source.map((item) => {
          return {
            ...item,
            content: '',
            disabled: false,
            total: 0,
          };
        });
        this.tabFilterItems = [...this.tabFilterItems, ...data];
      });
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
      this.loadData();
    });
  }

  /**
   * @function initTableValue initializing data into value of table
   */
  loadData() {
    this.loading = true;
    this.manageReservationService
      .getReservationItems<ReservationListResponse>(this.getQueryConfig())
      .subscribe(
        (res) => {
          this.reservationLists = new ReservationList().deserialize(res);
          this.values = this.reservationLists.reservationData.map((item) => {
            return {
              ...item,
              statusValues: this.getStatusValues(item.reservationType),
            };
          });
          this.updateTabFilterCount(res.entityTypeCounts, res.total);
          this.updateQuickReplyFilterCount(res.entityStateCounts);
          this.updateTotalRecords();
        },
        this.handleError,
        this.handleFinal
      );
    this.loading = false;
  }

  /**
   * @function getStatusValues To get status value.
   */
  getStatusValues(status) {
    return [
      {
        label: 'Draft',
        value: ReservationStatusType.DRAFT,
        type: 'warning',
        disabled: status === ReservationStatusType.DRAFT ? true : false,
      },
      {
        label: 'Cancel',
        value: ReservationStatusType.CANCELLED,
        type: 'failed',
        disabled: status === ReservationStatusType.CANCELLED ? true : false,
      },
      {
        label: 'Confirm',
        value: ReservationStatusType.CONFIRMED,
        type: 'new',
        disabled: status === ReservationStatusType.CONFIRMED ? true : false,
      },
    ];
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
  */
  handleStatus(status: ReservationStatusType, reservationData): void { 
      const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        const togglePopupCompRef = this.modalService.openDialog(
          ModalComponent,
          dialogConfig
        );

        togglePopupCompRef.componentInstance.content = {
          heading: `Mark Booking As ${status.charAt(0).toUpperCase()+status.slice(1).toLowerCase()}`,
          description: [ 
            `You are about to mark this booking as ${status}`,
            'Are you Sure?',
          ],
        };
        togglePopupCompRef.componentInstance.actions = [
          {
            label: 'No',
            onClick: () => this.modalService.close(),
            variant: 'outlined',
          },
          {
            label: 'Yes',
            onClick: () => { 
              this.changeStatus(status,reservationData);
              this.modalService.close();
            },
            variant: 'contained',
          },
        ];
        

        togglePopupCompRef.componentInstance.onClose.subscribe(() => {
          this.modalService.close();
        });
  }
  changeStatus(status:ReservationStatusType,reservationData){
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
            ).reservationType = status;
            this.values = this.values.map((item) => {
              return {
                ...item,
                statusValues: this.getStatusValues(item.reservationType),
              };
            });
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
    this.loadData();
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: 'ROOM_TYPE', entityId: this.hotelId },
      ]),
    };
    this.$subscription.add(
      this.manageReservationService.exportCSV(config).subscribe(
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
    // this.values = [];
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
