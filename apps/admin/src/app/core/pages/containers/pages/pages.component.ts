import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigService,
  CookiesSettingsService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { tokensConfig } from 'libs/admin/shared/src/lib/constants/common';
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
    private _snackbarService: SnackBarService,
    private cookiesSettingsService: CookiesSettingsService
  ) {}

  ngOnInit(): void {
    this.initAdminDetails();
  }

  /**
   * @function initAdminDetails Initialize admin details.
   */
  initAdminDetails() {
    const adminDetails = this._route.snapshot.data['adminDetails'];

    this.cookiesSettingsService.initHotelAccessDetails(
      adminDetails['manageSiteList']
    );

    this.getConfigData(localStorage.getItem(tokensConfig.entityId));
    this._userService.initUserDetails(get(adminDetails, ['userDetail']));

    // Setting cookies when login/refresh after setting userDetails
    this.cookiesSettingsService.$isPlatformCookiesLoaded.next(false);

    this._hotelDetailService.initHotelDetails(
      get(adminDetails, ['userDetail'])
    );

    const subscriptionDetails = get(adminDetails, ['subscription']);
    if (subscriptionDetails)
      this._subscriptionPlanService.initSubscriptionDetails(
        get(adminDetails, ['subscription'])
      );
  }

  getConfigData(entityId) {
    this._configService
      .getColorAndIconConfig(entityId)
      .subscribe((response) => this._configService.$config.next(response));
  }
}
