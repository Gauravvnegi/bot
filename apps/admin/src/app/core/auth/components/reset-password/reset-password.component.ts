import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isPasswordVisible: boolean = false;
  changePasswordToken: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _authService: AuthService
  ) {
    this.initResetForm();
  }

  ngOnInit(): void {
    this.getChangePasswordToken();
  }

  initResetForm() {
    this.resetPasswordForm = this._fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10),
          ],
        ],
        resetPassword: ['', [Validators.required]],
      },
      {
        validator: this._authService.matchPasswords(
          'password',
          'resetPassword'
        ),
      }
    );
  }

  getChangePasswordToken() {
    this._activatedRoute.queryParams.subscribe((params) => {
      this.changePasswordToken = params['token'];
    });
  }

  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      return;
    }
    const password = this.resetPasswordForm.get('password').value;
    this._authService
      .changePassword(this.changePasswordToken, password)
      .subscribe(
        () => {
          this._snackbarService.openSnackBarAsText(
            'Reset password successful',
            '',
            { panelClass: 'success' }
          );
          this.navigateToLogin();
        },
        (error) => {
          this._snackbarService.openSnackBarAsText(error.error.message);
        }
      );
  }

  navigateToLogin() {
    this._router.navigate(['/auth/login']);
  }
}
