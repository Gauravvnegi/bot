import { Component, OnInit } from '@angular/core';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { authConstants } from '../../constants/auth-constants';

@Component({
  selector: 'admin-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authConstants = authConstants;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Tracker for managing options
   * @param index
   * @param managingOptions
   * @returns id
   */
  trackById(index, managingOptions) {
    return managingOptions.id;
  }

  /**
   * Returns current year
   */
  get currentDate() {
    return DateService.getCurrentDateWithFormat('YYYY');
  }
}
