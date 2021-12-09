import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { authConstants } from '../../constants/auth-constants';
import { ValidatorService } from '../../services/validator-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isPasswordVisible = false;
  changePasswordToken: string;
  resetPasswordText: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _authService: AuthService,
    private _validatorService: ValidatorService,
    private readonly _translate: TranslateService
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
        if (response?.message) {
          this._snackbarService.openSnackBarAsText(response.message, '', {
            panelClass: 'success',
          });
        } else {
          this.showTranslatedMessage();
        }
        this.navigateToLogin();
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message ?? '');
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

  /**
   * @function showTranslatedMessage to get translated text.
   */
  showTranslatedMessage() {
    this._translate
      .get('messages.success.reset_password')
      .subscribe((translatedText) => {
        this._snackbarService.openSnackBarAsText(translatedText, '', {
          panelClass: 'success',
        });
      });
  }
}
