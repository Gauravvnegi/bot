import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-resend-password',
  templateUrl: './resend-password.component.html',
  styleUrls: ['./resend-password.component.scss'],
})
export class ResendPasswordComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  /**
   * Navigate to request password page
   * @author Amit Singh
   */
  navigateToRequestPassword() {
    this._router.navigate(['/auth/request-password']);
  }

  /**
   * Navigate to login page
   * @author Amit Singh
   */
  navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }
}
