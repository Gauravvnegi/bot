import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';
import routes from 'libs/admin/room/src/lib/constant/routes';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { RoomStatus } from 'libs/admin/room/src/lib/types/service-response';
import { HousekeepingService } from '../../services/housekeeping.service';
import { RoomCardData } from '../../types/room.-card.type';

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
    private housekeepingService: HousekeepingService
  ) {}

  ngOnInit(): void {}

  /**
   * @function handleRoomStatus handle the room status toggle
   * @param status room status
   * @param id room id
   */
  handleRoomStatus(status: RoomStatus, id: string): void {
    if (status === 'OUT_OF_ORDER' || status === 'OUT_OF_SERVICE') {
      this.router.navigate(
        [`/pages/efrontdesk/room/${routes.addRoom}/single`],
        {
          queryParams: { id: id },
        }
      );
      return;
    }
    this.roomService
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
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        () => {}
      );
  }
}
