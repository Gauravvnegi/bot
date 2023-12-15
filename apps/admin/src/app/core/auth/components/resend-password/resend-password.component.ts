import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * @class Resend password component.
 */
@Component({
  selector: 'admin-resend-password',
  templateUrl: './resend-password.component.html',
  styleUrls: ['./resend-password.component.scss'],
})
export class ResendPasswordComponent implements OnInit {
  email: string;

  constructor(private _router: Router, private route: ActivatedRoute) {
    this.email = this._router?.getCurrentNavigation()?.extras?.state?.email;
  }

  ngOnInit(): void {}

  /**
   * @function navigateToRequestPassword To navigate to request password page.
   */
  navigateToRequestPassword(): void {
    this._router.navigate(['/auth/request-password'], {
      state: {
        email: this.email,
      },
    });
  }

  /**
   * @function navigateToLogin To navigate to login page.
   */
  navigateToLogin(): void {
    this._router.navigate(['/auth/login']);
  }
}
