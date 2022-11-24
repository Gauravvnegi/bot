import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ConfigService } from 'libs/admin/shared/src/lib/services/config.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'hospitality-bot-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  $subscription = new Subscription();
  hotelId: string;
  requestConfiguration;
  constructor(
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.getColorConfig();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.hotelId = this.globalFilterService.hotelId;
      })
    );
  }

  getColorConfig() {
    this.configService.$config.subscribe((response) => {
      if (response)
        this.requestConfiguration = response.requestModuleConfiguration;
      else this.getColorConfigByHotelID();
    });
  }

  getColorConfigByHotelID() {
    this.configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.requestConfiguration = response.requestModuleConfiguration;
      });
  }

  getFilteredConfig(label) {
    return (
      this.requestConfiguration?.filter((d) => Object.keys(d)[0] === label)[0][
        label
      ] || []
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
