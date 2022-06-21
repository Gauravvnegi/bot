import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  HotelDetailService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class MainComponent implements OnInit {
  guestInfoEnable = false;
  outlets = [];
  colorMap;
  tabFilterItems = card.tabFilterItems;
  tabFilterIdx = 0;
  feedbackType: string;
  $subscription = new Subscription();
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private configService: ConfigService,
    private cardService: CardService,
    private tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.getConfig();
    this.listenForGlobalFilters();
    this.listenForTabFilterCounts();
    this.listenForFeedbackTypeChanged();
  }

  getConfig() {
    this.$subscription.add(
      this.configService.$config.subscribe((response) => {
        if (response) this.colorMap = response?.feedbackColorMap;
      })
    );
  }

  /**
   * @function listenForGlobalFilters To listen for filter data change.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getOutlets(data['filter'].value.property.branchName);
        this.feedbackType = data['filter'].value.feedback.feedbackType;
      })
    );
  }

  listenForTabFilterCounts() {
    this.$subscription.add(
      this.cardService.$tabValues.subscribe((response) => {
        if (response) {
          this.tabFilterItems.forEach(
            (tab) => (tab.total = response[tab.value])
          );
        }
      })
    );
  }

  /**
   * @function listenForFeedbackTypeChanged To listen the local tab change.
   */
  listenForFeedbackTypeChanged(): void {
    this.$subscription.add(
      this.tableService.$feedbackType.subscribe(
        (response) => (this.feedbackType = response)
      )
    );
  }

  /**
   * @function getOutlets To get outlets for a hotel.
   * @param branchId The branch id.
   */
  getOutlets(branchId: string): void {
    this.outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] == branchId
    ).outlets;
    this.outlets = [
      ...this.outlets,
      ...this._hotelDetailService.hotelDetails.brands[0].branches.filter(
        (branch) => branch['id'] == branchId
      ),
    ];
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.cardService.$selectedEntityType.next(
      this.tabFilterItems[event.index].value
    );
    this.cardService.$selectedFeedback.next(null);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  openGuestInfo(event) {
    if (event.openGuestInfo) {
      this.guestInfoEnable = true;
    }
  }

  closeGuestInfo(event) {
    if (event.close) {
      this.guestInfoEnable = false;
    }
  }
}
