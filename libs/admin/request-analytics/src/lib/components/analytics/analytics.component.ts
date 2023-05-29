import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ConfigService } from 'libs/admin/shared/src/lib/services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  welcomeMessage = 'Welcome To Request Analytics';
  navRoutes = [{ label: 'Request Analytics', link: './' }];

  hotelId: string;
  requestConfiguration: RequestConfiguration = {
    preArrival: [],
    inhouse: [],
  };

  $subscription = new Subscription();
  constructor(
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private snackBarService: SnackBarService
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
        //set-global query every time global filter changes
        this.hotelId = this.globalFilterService.hotelId;
      })
    );
  }

  /**
   * Handles getting the configuration of request module
   */
  getColorConfig() {
    this.configService.$config.subscribe((response?: ConfigurationResponse) => {
      const configuration = (data: ConfigurationResponse) => {
        if (!data?.requestModuleConfiguration) {
          this.snackBarService.openSnackBarAsText(
            'Problem getting Request Module Configuration'
          );
        }
        return Object.values(data.requestModuleConfiguration).reduce(
          (prev, curr) => {
            const [key, value] = Object.entries(curr)[0];
            prev[key] = value;
            return prev;
          },
          {}
        ) as RequestConfiguration;
      };

      if (response?.requestModuleConfiguration) {
        this.requestConfiguration = configuration(response);
        return;
      }
      // getting configuration is already not present
      this.configService
        .getColorAndIconConfig(this.hotelId)
        .subscribe((response: ConfigurationResponse) => {
          this.requestConfiguration = configuration(response);
        });
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

type Configuration = {
  label: string;
  color: string;
  icon: string;
};

type RequestTypes = 'preArrival' | 'inhouse';

type RequestConfiguration = Record<RequestTypes, Configuration[]>;

type ConfigurationResponse = {
  requestModuleConfiguration: {
    [key in RequestTypes]: Configuration[];
  }[];
};
