import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
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
import { cols, TableValue, title } from '../../constant/data-table';
import { roomStatusDetails } from '../../constant/response';
import routes from '../../constant/routes';
import { RoomList, RoomTypeList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig } from '../../types/room';
import {
  RoomListResponse,
  RoomStatus,
  RoomTypeListResponse,
  RoomTypeStatus,
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
  readonly roomStatusDetails = roomStatusDetails;

  entityId: string;
  $subscription = new Subscription();
  selectedTab: TableValue;
  tabFilterIdx: number = 0; 
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
    this.entityId = this.globalFilterService.entityId;
    this.roomService.resetRoomTypeFormState();

    this.selectedTab = this.roomService.selectedTable;
    this.selectedTab === TableValue.roomType ? this.tabFilterIdx = 0 : this.tabFilterIdx = 1;
    this.getDataTableValue();
    this.tableName = title[this.selectedTab];
  }

  loadData(event: LazyLoadEvent): void {
    this.tableName = title[this.selectedTab];
    this.roomService.selectedTable = this.selectedTab;
    this.getDataTableValue();
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
  // getSelectedQuickReplyFilters() {
  //   const chips = this.tabFilterItems[this.tabFilterIdx].chips.filter(
  //     (item) => item.isSelected && item.value !== 'ALL'
  //   );
  //   return this.selectedTab === 'ROOM'
  //     ? chips.map((item) => ({ roomStatus: item.value }))
  //     : [
  //         chips.length !== 1
  //           ? { roomTypeStatus: null }
  //           : { roomTypeStatus: chips[0].value === 'ACTIVE' },
  //       ];
  // }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2({
          isStatusBoolean: this.selectedTab === TableValue.roomType,
        }),
        {
          type: this.selectedTab,
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
    this.cols = cols[this.selectedTab];
    this.tableName = title[this.selectedTab];
    // this.filterChips = filter[this.tabFilterIdx].chips;
    // this.totalRecords = this.filterChips
    //   .filter((item) => item.isSelected)
    //   .reduce((p, c) => p + c.total, 0);
  };

  /**
   * Get table related data from service
   * @param table selected table value
   */
  getDataTableValue(): void {
    this.loading = true;
    if (this.selectedTab === TableValue.room)
      this.$subscription.add(
        this.roomService
          .getList<RoomListResponse>(this.entityId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomList = new RoomList().deserialize(res);
              this.values = roomList.records;
              // this.updateQuickReplyFilterCount(res.entityStateCounts);
              // this.updateTabFilterCount(res.entityTypeCounts, res.total);
              // this.updateTotalRecords();
              this.initFilters(
                roomList.entityTypeCounts,
                roomList.entityStateCounts,
                roomList.totalRecord,
                this.roomStatusDetails
              );
              this.loading = false;
            },
            () => {
              this.values = [];
              this.loading = false;
            },
            this.initTableDetails
          )
      );

    if (this.selectedTab === TableValue.roomType)
      this.$subscription.add(
        this.roomService
          .getList<RoomTypeListResponse>(this.entityId, this.getQueryConfig())
          .subscribe(
            (res) => {
              const roomTypesList = new RoomTypeList().deserialize(res);
              this.values = roomTypesList.records;
              // this.updateQuickReplyFilterCount(res.entityStateCounts);
              // this.updateTabFilterCount(res.entityTypeCounts, res.total);
              // this.updateTotalRecords();
              this.initFilters(
                roomTypesList.entityTypeCounts,
                roomTypesList.entityStateCounts,
                roomTypesList.totalRecord,
                this.roomStatusDetails
              );

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
        .updateRoomStatus(this.entityId, {
          rooms: [{ id, roomStatus: status }],
        })
        .subscribe(
          () => {
            this.getDataTableValue();
          },
          () => {
            this.loading = false;
          }
        )
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
        .updateRoomTypeStatus(this.entityId, {
          id,
          status,
        })
        .subscribe(
          () => this.getDataTableValue(),
          () => {
            this.loading = false;
          }
        )
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: RoomStatus | RoomTypeStatus, rowData): void {
    if (this.selectedTab === TableValue.room) {
      this.handleRoomStatus(status as RoomStatus, rowData.id);
    }

    if (this.selectedTab === TableValue.roomType) {
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
   * @function openEditForm handle the room or room type form open
   * @param rowData clicked row data
   */
  openEditForm(rowData): void {
    if (this.selectedTab === TableValue.room) {
      this.router.navigate([`/pages/inventory/room/${routes.addRoom}/single`], {
        queryParams: { id: rowData.id },
      });
    }
    if (this.selectedTab === TableValue.roomType) {
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
        .exportCSV(this.entityId, this.selectedTab, config)
        .subscribe(
          (res) => {
            FileSaver.saveAs(
              res,
              `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
            );
          },
          () => {},
          () => {
            this.loading = false;
          }
        )
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
