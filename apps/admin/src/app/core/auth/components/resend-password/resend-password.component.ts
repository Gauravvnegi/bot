import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @class Resend password component.
 */
@Component({
  selector: 'admin-resend-password',
  templateUrl: './resend-password.component.html',
  styleUrls: ['./resend-password.component.scss'],
})
export class ResendPasswordComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  /**
   * @function navigateToRequestPassword To navigate to request password page.
   */
  navigateToRequestPassword(): void {
    this._router.navigate(['/auth/request-password']);
  }

  /**
   * @function navigateToLogin To navigate to login page.
   */
  navigateToLogin(): void {
    this._router.navigate(['/auth/login']);
  }
}
