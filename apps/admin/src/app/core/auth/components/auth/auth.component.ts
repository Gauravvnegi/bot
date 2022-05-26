import { Component, OnInit } from '@angular/core';
import { DateService } from '@hospitality-bot/shared/utils';
import { authConstants } from '../../constants/auth';
import { ManagingOption } from '../../types/auth.type';

@Component({
  selector: 'admin-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authConstants = authConstants;

  slideConfig = {
    slidesToShow: 1, 
    slidesToScroll: 1, 
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  constructor() {}

  ngOnInit(): void {}

  /**
   * @function trackById To track managing options by id.
   * @param index The current index of option.
   * @param managingOptions The current managing option.
   * @returns The id to track ech option uniquely.
   */
  trackById(index: number, managingOptions: ManagingOption): number {
    return managingOptions.id;
  }

  /**
   * @function currentDate To get the current year.
   * @returns The current year.
   */
  get currentDate(): string {
    return DateService.getCurrentDateWithFormat('YYYY');
  }
}
