import { Component, OnInit } from '@angular/core';
import { UserService } from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';

import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
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
    private _feedbackService: FeedbackService,
    private _route: ActivatedRoute,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    const adminDetails = this._route.snapshot.data['adminDetails'];
    this._userService.initUserDetails(get(adminDetails, ['userDetail']));
    this._hotelDetailService.initHotelDetails(
      get(adminDetails, ['userDetail'])
    );
    this.subscriptionPlanService.initSubscriptionDetails(
      get(adminDetails, ['subscription'])
    );
    this._feedbackService.initFeedbackConfig(
      this._route.snapshot.data['feedbackConfig']
    );
  }
}
