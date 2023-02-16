import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'hospitality-bot-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  statsArr = [];

  hotelId: string;
  $subscription = new Subscription();

  constructor(
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilter();
  }

  listenForGlobalFilter(): void {
    this.hotelId = this.globalFilterService.hotelId;

    this.$subscription.add(
      this.roomService.getStats(this.hotelId).subscribe((res) => {
        this.statsArr = res;
      })
    );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
