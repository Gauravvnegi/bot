import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  HotelDetailService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  outlets = [];
  colorMap;
  tabFilterItems = card.tabFilterItems;
  tabFilterIdx = 1;
  $subscription = new Subscription();
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private configService: ConfigService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.getConfig();
    this.listenForGlobalFilters();
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
      })
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
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
