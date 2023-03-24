import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelDetailService, UserService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private hotelDetailService: HotelDetailService
  ) {}

  ngOnInit(): void {
    this.initUserDetails();
  }

  initUserDetails() {
    const userDetails = this.route.snapshot.data['userDetails'];
    this.userService.initUserDetails(userDetails);
    this.hotelDetailService.initHotelDetails(userDetails);
  }
}
