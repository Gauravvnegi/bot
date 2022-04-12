import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService, UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { get } from 'lodash';
import { SubscriptionPlanService } from '../../../theme/src/lib/services/subscription-plan.service';

@Component({
  selector: 'admin-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _route: ActivatedRoute,
    private _subscriptionPlanService: SubscriptionPlanService,
    private _configService: ConfigService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initAdminDetails();
  }

  /**
   * @function initAdminDetails Initialize admin details.
   */
  initAdminDetails() {
    const adminDetails = this._route.snapshot.data['adminDetails'];
    this.getConfigData(
      get(adminDetails, ['userDetail'])?.hotelAccess?.chains[0]?.hotels[0]?.id
    );
    this._userService.initUserDetails(get(adminDetails, ['userDetail']));
    this._hotelDetailService.initHotelDetails(
      get(adminDetails, ['userDetail'])
    );

    this._subscriptionPlanService.initSubscriptionDetails(
      get(adminDetails, ['subscription'])
    );
  }

  getConfigData(hotelId) {
    this._configService.getColorAndIconConfig(hotelId).subscribe(
      (response) => this._configService.$config.next(response),
      ({ error }) =>
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe()
    );
  }
}
