import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Chip,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import routes from '../../config/routes';
import {
  cols,
  filter,
  Status,
  status,
  StatusEntity,
  title,
} from '../../constant/data-table';
import {
  RoomList,
  RoomRecordsCount,
  RoomTypeList,
  RoomTypeRecordsCount,
} from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig, TableValue } from '../../types/room';
import { RoomStatus } from '../../types/service-response';

@Component({
  selector: 'hospitality-bot-room-data-table',
  templateUrl: './room-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './room-data-table.component.scss',
  ],
})
export class RoomDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = routes;
  readonly status = status;

  hotelId: string;
  $subscription = new Subscription();
  cols: Cols[] = [];
  tableName: string;
  tabFilterItems = filter;
  tabFilterIdx: number = 0;
  selectedTable: TableValue;
  filterChips: Chip<string>[] = [];

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;

    this.roomService.selectedTable.subscribe((value) => {
      this.tabFilterIdx = this.tabFilterItems.findIndex(
        (item) => item.value === value
      );
      this.selectedTable = value;
      this.getDataTableValue(this.selectedTable);
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.getDataTableValue(this.selectedTable);
  }

  /**
   * @function setRecordsCount To set the total no. of records
   * @param recordCounts
   */
  setRecordsCount(recordCounts: RoomRecordsCount | RoomTypeRecordsCount) {
    this.tabFilterItems[this.tabFilterIdx].chips.forEach((item) => {
      item.total = recordCounts[item.value];
    });
    this.totalRecords = recordCounts.total;
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.tabFilterItems[this.tabFilterIdx].chips.filter(
      (item) => item.isSelected && item.value !== 'total'
    );
    return this.selectedTable === 'room'
      ? chips.map((item) => ({ roomStatus: StatusEntity[item.value] }))
      : [
          chips.length !== 1
            ? { roomTypeStatus: null }
            : { roomTypeStatus: chips[0].value === 'active' },
        ];
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * Initial selection of table
   */
  initTableDetails = () => {
    this.cols = cols[this.selectedTable];
    this.tableName = title[this.selectedTable];
    this.filterChips = filter[this.tabFilterIdx].chips;
  };

  /**
   * Get table related data from service
   * @param table selected table value
   */
  getDataTableValue(table: TableValue): void {
    this.loading = true;

    if (table === 'room')
      this.$subscription.add(
        this.roomService
          .getRoomsList(this.hotelId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomList = new RoomList().deserialize(res);
              this.values = roomList.records;
              this.setRecordsCount(roomList.count);
              this.loading = false;
            },
            this.handleError,
            this.initTableDetails
          )
      );

    if (table === 'roomType')
      this.$subscription.add(
        this.roomService
          .getRoomsTypeList(this.hotelId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomTypesList = new RoomTypeList().deserialize(res);
              this.values = roomTypesList.records;
              this.setRecordsCount(roomTypesList.count);
              this.loading = false;
            },
            this.handleError,
            this.initTableDetails
          )
      );
  }

  /**
   * @function handleRoomStatus handle the room status toggle
   * @param status room status
   * @param id room id
   */
  handleRoomStatus(status: RoomStatus, id: string): void {
    this.loading = true;

    this.$subscription.add(
      this.roomService
        .updateRoomStatus(this.hotelId, {
          id,
          roomStatus: status,
        })
        .subscribe(() => this.handleStatusSuccess(status, id), this.handleError)
    );
  }

  /**
   * @function handleRoomStatus handle the room type status toggle
   * @param status room type status
   * @param id room type id
   */
  handleRoomTypeStatus(status: boolean, id: string): void {
    this.loading = true;

    this.$subscription.add(
      this.roomService
        .updateRoomTypeStatus(this.hotelId, {
          id,
          status,
        })
        .subscribe(
          () => this.handleStatusSuccess(status ? 'ACTIVE' : 'INACTIVE', id),
          this.handleError
        )
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: RoomStatus, rowData): void {
    if (this.selectedTable === 'room') {
      this.handleRoomStatus(status, rowData.id);
    }

    if (this.selectedTable === 'roomType') {
      const roomTypeStatus = status === 'ACTIVE';
      if (!roomTypeStatus) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        const togglePopupCompRef = this.modalService.openDialog(
          ModalComponent,
          dialogConfig
        );

        const soldOut = rowData.roomCount.soldOut;

        if (soldOut) {
          togglePopupCompRef.componentInstance.content = {
            heading: 'Unpublish Page',
            description: [
              `${soldOut} rooms are already sold out in this category`,
              'You can not mark this room type inactive',
            ],
          };
          togglePopupCompRef.componentInstance.actions = undefined;
        } else {
          togglePopupCompRef.componentInstance.content = {
            heading: 'In-active Room Type',
            description: [
              `There are ${rowData.roomCount.active} rooms in this room type`,
              'You are about to mark this room type in-active.',
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
                this.handleRoomTypeStatus(roomTypeStatus, rowData.id);
                this.modalService.close();
              },
              variant: 'contained',
            },
          ];
        }

        togglePopupCompRef.componentInstance.onClose.subscribe(() => {
          this.modalService.close();
        });
      } else {
        this.handleRoomTypeStatus(roomTypeStatus, rowData.id);
      }
    }
  }

  /**
   * @function handleStatusSuccess To update the status after successful update
   * @param status
   * @param rowData
   */
  handleStatusSuccess = (status: RoomStatus, id: string): void => {
    this.loading = false;
    this.values.find((item) => item.id === id).status = {
      label: Status[status],
      value: status,
    };
  };

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.roomService.selectedTable.next(this.tabFilterItems[event.index].value);
  }

  /**
   * @function openEditForm handle the room or room type form open
   * @param rowData clicked row data
   */
  openEditForm(rowData): void {
    const selectedRoute =
      this.selectedTable === 'room'
        ? `${routes.addRoom}/single`
        : routes.addRoomType;
    this.router.navigate([`/pages/inventory/room/${selectedRoute}`], {
      queryParams: { id: rowData.id },
    });
  }

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   *
   */
  toggleQuickReplyFilter({ chips }: { chips: Chip<string>[] }): void {
    this.tabFilterItems[this.tabFilterIdx].chips = chips;
    this.changePage(0);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.roomService
        .exportCSV(this.hotelId, this.selectedTable, config)
        .subscribe((res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        }, this.handleError)
    );
  }

  /**
   * @function handleError to show the error
   * @param param0
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

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}