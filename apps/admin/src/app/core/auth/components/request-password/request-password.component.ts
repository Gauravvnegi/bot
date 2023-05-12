import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from '@hospitality-bot/admin/shared';
import { AuthService } from '../../services/auth.service';

/**
 * @class Request password component
 */
@Component({
  selector: 'admin-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss'],
})
export class RequestPasswordComponent implements OnInit {
  requestPasswordForm: FormGroup;
  isEmailSent: boolean;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _snackbarService: SnackBarService
  ) {
    this.initRequestForm();
  }

  ngOnInit(): void {}

  /**
   * @function initRequestForm To initialize request password form.
   */
  initRequestForm(): void {
    this.requestPasswordForm = this._fb.group({
      email: [
        this._router.getCurrentNavigation().extras.state.email,
        [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)],
      ],
    });
  }

  /**
   * @function requestPassword To request for a new password.
   */
  requestPassword(): void {
    if (!this.requestPasswordForm.valid) {
      return;
    }
    const requestData = {
      email: this.requestPasswordForm?.get('email')?.value ?? ''.trim(),
    };
    this._authService.forgotPassword(requestData).subscribe(
      (response) => {
        this.isEmailSent = response.status ?? false;
        this._snackbarService.openSnackBarAsText(response?.message, '', {
          panelClass: 'success',
        });
        this._router.navigate(['/auth/resend-password']);
      } 
    );
  }

  /**
   * @function navigateToLogin To navigate to login route.
   */
  navigateToLogin(): void {
    this._router.navigate(['/auth']);
  }
}
