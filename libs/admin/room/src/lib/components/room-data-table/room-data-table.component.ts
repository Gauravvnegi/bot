import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Chip,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { cols, filter, Status, status, title } from '../../constant/data-table';
import {
  RoomList,
  RoomRecordsCount,
  RoomTypeList,
  RoomTypeRecordsCount,
} from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig, TableValue } from '../../types/room';

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
  hotelId: string;
  $subscription = new Subscription();
  cols: Cols[];
  tableName: string;
  tabFilterItems = filter;
  tabFilterIdx: number = 0;
  selectedTable: TableValue;
  status = status;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initSelectedTable('room');
  }

  loadData(event: LazyLoadEvent): void {
    this.initSelectedTable(this.selectedTable);
  }

  /**
   * Initial selection of table
   */
  initSelectedTable(table: TableValue) {
    this.cols = cols[table];
    this.selectedTable = table;
    this.tableName = title[table];
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
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected && item.value !== 'total')
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * Get table related data from service
   * @param table selected table value
   */
  getDataTableValue(table: TableValue) {
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };

    this.loading = true;

    if (table === 'room')
      this.$subscription.add(
        this.roomService.getRoomsList(this.hotelId, config).subscribe((res) => {
          const roomList = new RoomList().deserialize(res);
          this.values = roomList.records;
          this.setRecordsCount(roomList.count);
          this.loading = false;
        })
      );

    if (table === 'roomType')
      this.$subscription.add(
        this.roomService
          .getRoomsTypeList(this.hotelId, config)
          .subscribe((res) => {
            const roomTypesList = new RoomTypeList().deserialize(res);
            this.values = roomTypesList.records;
            this.setRecordsCount(roomTypesList.count);
            this.loading = false;
          })
      );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status
   */
  handleStatus(status: string, rowData) {
    this.values.find((item) => item.id === rowData.id).status = {
      label: Status[status],
      value: status,
    };
  }

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.selectedTable = this.tabFilterItems[this.tabFilterIdx].value;
    this.initSelectedTable(this.selectedTable);
    // this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param event The event for sort click action.
   */
  customSort(event: SortEvent): void {}

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   *
   */
  toggleQuickReplyFilter({ chips }: { chips: Chip<string>[] }) {
    this.tabFilterItems[this.tabFilterIdx].chips = chips;
    this.changePage(0);
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
