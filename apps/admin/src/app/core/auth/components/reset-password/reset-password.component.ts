import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { authConstants } from '../../constants/auth';
import { AuthService } from '../../services/auth.service';

/**
 * @class Reset Password Component.
 */
@Component({
  selector: 'admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isPasswordVisible = false;
  changePasswordToken: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _authService: AuthService,
    private _validatorService: ValidatorService
  ) {
    this.initResetForm();
  }

  ngOnInit(): void {
    this.getChangePasswordToken();
  }

  /**
   * @function initResetForm To initialize the reset password form.
   */
  initResetForm(): void {
    this.resetPasswordForm = this._fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(authConstants.passwordMinLength),
            Validators.maxLength(authConstants.passwordMaxLength),
          ],
        ],
        resetPassword: ['', [Validators.required]],
      },
      {
        validator: this._validatorService.matchPasswords(
          'password',
          'resetPassword'
        ),
      }
    );
  }

  /**
   * @function getChangePasswordToken To get the value of change password token.
   */
  getChangePasswordToken(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['token']) this.changePasswordToken = params['token'];
    });
  }

  /**
   * @function resetPassword To reset user password.
   */
  resetPassword(): void {
    if (!this.resetPasswordForm?.valid) {
      return;
    }

    const data = {
      token: this.changePasswordToken,
      password: this.resetPasswordForm?.get('password')?.value,
    };

    this._authService.changePassword(data).subscribe(
      (response) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.success.reset_password',
              priorityMessage: response?.message,
            },
            '',
            { panelClass: 'success' }
          )
          .subscribe();

        this.navigateToLogin();
      },
      ({ error }) => {
        this._snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe();
      }
    );
  }

  /**
   * @function navigateToLogin To navigate to login page.
   */
  navigateToLogin(): void {
    this._router.navigate(['/auth/login']);
  }
}
