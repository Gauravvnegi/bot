import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { roomDetailsCols, TableValue } from '../../constant/data-table';
import routes from '../../constant/routes';
import { RoomList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig } from '../../types/room';
import { RoomListResponse } from '../../types/service-response';

@Component({
  selector: 'hospitality-bot-room-details-data-table',
  templateUrl: './room-details-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './room-details-data-table.component.scss',
  ],
})
export class RoomDetailsDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  hotelId: string;
  cols = roomDetailsCols;
  @Input() roomTypeId: string;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getDataTableValue();
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: TableValue.room,
          offset: this.first,
          limit: this.rowsPerPage,
          // ---refactor---- room type query param for selected room data - BE dependent
          roomTypeId: this.roomTypeId, 
        },
      ]),
    };
    return config;
  }

  loadData(event: LazyLoadEvent): void {
    this.getDataTableValue();
  }

  getDataTableValue() {
    this.loading = true;
    this.roomService
      .getList<RoomListResponse>(this.hotelId, this.getQueryConfig())
      .subscribe(
        (res) => {
          const roomList = new RoomList().deserialize(res);
          this.values = roomList.records;
          this.updateTotalRecords();
          console.log(this.totalRecords);
          this.loading = false;
        },
        () => {
          this.values = [];
          this.loading = false;
        }
      );
  }

  onEditRoom(id: string) {
    this.router.navigate([`/pages/inventory/room/${routes.addRoom}/single`], {
      queryParams: { id },
    });
  }
}
