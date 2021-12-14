import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { authConstants } from '../../constants/auth-constants';
import { ValidatorService } from '../../services/validator-service';

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
   * Reset form initialization
   * @author Amit Singh
   */
  initResetForm() {
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
   * Gets the value of change password token
   * @author Amit Singh
   */
  getChangePasswordToken() {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['token']) this.changePasswordToken = params['token'];
    });
  }

  /**
   * Reset password
   * @returns null
   * @author Amit Singh
   */
  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      return;
    }

    const data = {
      token: this.changePasswordToken,
      password: this.resetPasswordForm.get('password').value,
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
   * Navigate to login page
   * @author Amit Singh
   */
  navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }
}
