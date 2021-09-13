import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NotificationComponent } from 'libs/admin/notification/src/lib/components/notification/notification.component';
import {
  CardNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  public cards = CardNames;
  tables = TableNames;
  hotelId: string;
  $subscription = new Subscription();

  tabFilterIdx = 0;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];
  constructor(
    private _modal: ModalService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
      })
    );
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }

  openRequestFeedbackForm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const notificationCompRef = this._modal.openDialog(
      NotificationComponent,
      dialogConfig
    );
    notificationCompRef.componentInstance.hotelId = this.hotelId;
    notificationCompRef.componentInstance.isEmail = true;
    notificationCompRef.componentInstance.isModal = true;
    notificationCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      notificationCompRef.close();
    });
  }
}
