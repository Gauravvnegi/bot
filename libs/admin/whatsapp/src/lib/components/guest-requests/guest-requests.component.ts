import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'hospitality-bot-guest-requests',
  templateUrl: './guest-requests.component.html',
  styleUrls: ['./guest-requests.component.scss'],
})
export class GuestRequestsComponent implements OnInit {
  $subscription = new Subscription();
  hotelId: string;
  constructor(
    private messageService: MessageService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForRefreshData();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getRequestList();
      })
    );
  }

  listenForRefreshData() {
    this.$subscription.add(
      this.messageService.refreshRequestList$.subscribe((response) => {
        if (response) {
          this.getRequestList();
        }
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getRequestList() {}
}
