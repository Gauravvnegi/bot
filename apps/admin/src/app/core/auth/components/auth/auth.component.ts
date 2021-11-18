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
  managingOptions = authConstants.managingOptions;

  constructor() {}

  ngOnInit(): void {}

  get currentDate() {
    return DateService.getCurrentDateWithFormat('YYYY');
  }

  trackById(index, managingOptions) {
    return managingOptions.id;
  }
}
