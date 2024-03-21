import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';
import routes from 'libs/admin/room/src/lib/constant/routes';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { RoomStatus } from 'libs/admin/room/src/lib/types/service-response';
import { HousekeepingService } from '../../services/housekeeping.service';
import { RoomCardData } from '../../types/room.-card.type';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent implements OnInit {
  @Input() data: RoomCardData;
  @Input() recordSetting;
  @Input() entityId: string;

  constructor(
    private router: Router,
    private roomService: RoomService,
    private snackbarService: SnackBarService,
    private housekeepingService: HousekeepingService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

  /**
   * @function handleRoomStatus handle the room status toggle
   * @param status room status
   * @param id room id
   */
  handleRoomStatus(status: RoomStatus, id: string): void {
    if (status === 'OUT_OF_ORDER' || status === 'OUT_OF_SERVICE') {
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.ROOM,
        additionalPath: `${routes.addRoom}/single`,
        queryParams: { id: id, data: btoa(JSON.stringify({ status: status })) },
      });
      return;
    }
    this.housekeepingService
      .updateRoomStatus(this.entityId, {
        room: {
          id: id,
          statusDetailsList: [{ isCurrentStatus: true, status: status }],
        },
      })
      .subscribe(
        () => {
          this.housekeepingService.refreshData.next(true);
          this.snackbarService.openSnackBarAsText(
            'Status changed successfully',
            '',
            { panelClass: 'success' }
          );
        },
        () => {}
      );
  }
}
