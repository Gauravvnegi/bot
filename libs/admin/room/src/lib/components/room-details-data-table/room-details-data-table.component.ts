import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  FlagType,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { roomDetailsCols, TableValue } from '../../constant/data-table';
import routes from '../../constant/routes';
import { RoomList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig } from '../../types/room';
import { RoomListResponse } from '../../types/service-response';
import { roomStatusDetails } from '../../constant/response';

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
  readonly roomStatusDetails = roomStatusDetails;
  entityId: string;
  cols = roomDetailsCols;
  currentRoomState: { value: string; type: FlagType }[] = [];
  @Input() roomTypeId: string;

  constructor(
    public fb: FormBuilder,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private router: Router,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getDataTableValue();
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: TableValue.room,
          offset: this.first,
          limit: this.rowsPerPage,
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
      .getList<RoomListResponse>(this.entityId, this.getQueryConfig())
      .subscribe(
        (res) => {
          const roomList = new RoomList().deserialize(res);
          this.values = roomList.records;
          this.initFilters({}, {}, roomList.totalRecord);
          this.loading = false;
        },
        () => {
          this.values = [];
          this.loading = false;
        }
      );
  }

  onEditRoom(id: string) {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ROOM,
      additionalPath: routes.addSingleRoom,
      queryParams: { id },
    });
  }
}
