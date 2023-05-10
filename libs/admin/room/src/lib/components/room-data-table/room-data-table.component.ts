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
import {
  Status,
  StatusEntity,
  TableValue,
  cols,
  filter,
  status,
  title,
} from '../../constant/data-table';
import routes from '../../constant/routes';
import {
  RoomList,
  RoomRecordsCount,
  RoomStateCounts,
  RoomTypeCounts,
  RoomTypeList,
} from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig } from '../../types/room';
import {
  RoomListResponse,
  RoomStatus,
  RoomTypeListResponse,
} from '../../types/service-response';

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
  isQuickFilters = true;

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
    this.roomService.resetRoomTypeFormState();

    this.$subscription.add(
      this.roomService.selectedTable.subscribe((value) => {
        this.tabFilterIdx = this.tabFilterItems.findIndex(
          (item) => item.value === value
        );
        this.selectedTable = value;
        this.getDataTableValue(this.selectedTable);
      })
    );
  }

  loadData(event: LazyLoadEvent): void {
    this.getDataTableValue(this.selectedTable);
  }

  // /**
  //  * @function setRecordsCount To set the total no. of records
  //  * @param recordCounts
  //  */
  // setRecordsCount(recordCounts: RoomRecordsCount | RoomStateCounts) {
  //   this.tabFilterItems[this.tabFilterIdx].chips.forEach((item) => {
  //     item.total = recordCounts[item.value];
  //   });
  // }

  // setTypeCounts(recordCounts: RoomTypeCounts) {
  //   this.tabFilterItems.forEach((item) => {
  //     item.total = recordCounts[item.value];
  //   });
  // }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.tabFilterItems[this.tabFilterIdx].chips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return this.selectedTable === 'ROOM'
      ? chips.map((item) => ({ roomStatus: item.value }))
      : [
          chips.length !== 1
            ? { roomTypeStatus: null }
            : { roomTypeStatus: chips[0].value === 'ACTIVE' },
        ];
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          type: this.selectedTable,
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
    this.totalRecords = this.filterChips
      .filter((item) => item.isSelected)
      .reduce((p, c) => p + c.total, 0);
  };

  /**
   * Get table related data from service
   * @param table selected table value
   */
  getDataTableValue(table: TableValue): void {
    this.loading = true;

    if (table === TableValue.room)
      this.$subscription.add(
        this.roomService
          .getList<RoomListResponse>(this.hotelId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomList = new RoomList().deserialize(res);
              this.values = roomList.records;
              this.updateQuickReplyFilterCount(res.entityStateCounts);
              this.updateTabFilterCount(res.entityTypeCounts, res.total);
              this.updateTotalRecords();
              this.loading = false;
            },
            () => {
              this.values = [];
              this.loading = false;
            },
            this.initTableDetails
          )
      );

    if (table === TableValue.roomType)
      this.$subscription.add(
        this.roomService
          .getList<RoomTypeListResponse>(this.hotelId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomTypesList = new RoomTypeList().deserialize(res);
              this.values = roomTypesList.records;
              this.updateQuickReplyFilterCount(res.entityStateCounts);
              this.updateTabFilterCount(res.entityTypeCounts, res.total);
              this.updateTotalRecords();

              this.loading = false;
            },
            () => {
              this.loading = false;
            },
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
          rooms: [{ id, roomStatus: status }],
        })
        .subscribe(() => this.handleStatusSuccess(status, id))
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
        .subscribe(() =>
          this.handleStatusSuccess(status ? 'ACTIVE' : 'INACTIVE', id)
        )
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: RoomStatus, rowData): void {
    if (this.selectedTable === TableValue.room) {
      this.handleRoomStatus(status, rowData.id);
    }

    if (this.selectedTable === TableValue.roomType) {
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
    this.resetTable();
    this.roomService.selectedTable.next(this.tabFilterItems[event.index].value);
  }

  /**
   * @function openEditForm handle the room or room type form open
   * @param rowData clicked row data
   */
  openEditForm(rowData): void {
    if (this.selectedTable === TableValue.room) {
      this.router.navigate([`/pages/inventory/room/${routes.addRoom}/single`], {
        queryParams: { id: rowData.id },
      });
    }
    if (this.selectedTable === TableValue.roomType) {
      this.router.navigate([
        `/pages/inventory/room/${routes.addRoomType}/${rowData.id}`,
      ]);
    }
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
        })
    );
  }

  /**
   * @function handleError to show the error
   * @param param0
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
