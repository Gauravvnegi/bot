import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FeedbackNotificationComponent } from '@hospitality-bot/admin/notification';
import { CardNames, TableNames } from '@hospitality-bot/admin/shared';
import { StatisticsService } from '@hospitality-bot/admin/shared';
import { HotelDetailService } from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
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
  outlets;
  outletIds;

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
    protected _modal: ModalService,
    protected _globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected statisticsService: StatisticsService
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

  /**
   * @function openFeedbackRequestPage To open the raise request form modal.
   * @param event The mouse click event.
   */
  openFeedbackRequestPage(event: MouseEvent) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const detailCompRef = this._modal.openDialog(
      FeedbackNotificationComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.hotelId = this.hotelId;

    this.$subscription.add(
      detailCompRef.componentInstance.onModalClose.subscribe((res) => {
        // remove loader for detail close
        detailCompRef.close();
      })
    );
  }
}
