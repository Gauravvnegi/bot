import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NotificationComponent } from 'libs/admin/notification/src/lib/components/notification/notification.component';
import {
  CardNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
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
    private _modal: ModalService,
    private _globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService
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
        console.log(data);
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getOutletsSelected([...data['feedback'].queryValue]);
        if (data['feedback'].value.feedbackType === 'Transactional')
          this.getOutlets(data['filter'].value.property.branchName);
      })
    );
  }

  getOutlets(branchId) {
    this.outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] == branchId
    ).outlets;
    this.tabFilterItems = [
      {
        label: 'Overall',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: [],
      },
    ];
    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push({
          label: outlet.name,
          content: '',
          value: outlet.id,
          disabled: false,
          total: 0,
          chips: [],
        });
      }
    });
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getOutletsSelected(globalQueries) {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
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
