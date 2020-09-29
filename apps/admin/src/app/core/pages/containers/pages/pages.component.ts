import { Component, OnInit } from '@angular/core';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  constructor(
    private _userDetailService: UserDetailService,
    private _hotelDetailService: HotelDetailService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userDetails = this._route.snapshot.data['userDetails'];
    this._userDetailService.userDetails = userDetails;
    this._userDetailService.initUserDetails(userDetails);
    this._hotelDetailService.initHotelDetails(userDetails);
  }
}
