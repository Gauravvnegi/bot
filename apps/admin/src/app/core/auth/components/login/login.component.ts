import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Regex } from 'libs/shared/constants/regex';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '@hospitality-bot/admin/shared';
import { authConstants } from '../../constants/auth-constants';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isSigningIn = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _snackbarService: SnackBarService
  ) {
    this.initLoginForm();
  }

  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['/pages/dashboard']);
    }
  }

  /**
   * Login form initialization
   * @author Amit Singh
   */
  initLoginForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(authConstants.passwordMinLength),
          Validators.maxLength(authConstants.passwordMaxLength),
        ],
      ],
    });
  }

  /**
   * Admin Login
   * @returns null
   * @author Amit Singh
   */
  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.isSigningIn = true;
    const data = this.loginForm.getRawValue();
    data.email = data.email.toLowerCase().trim();
    this._authService.login(data).subscribe(
      (response) => {
        this._userService.setLoggedInUserId(response.id);
        this._router.navigate(['/pages/dashboard']);
      },
      ({ error }) => {
        this.isSigningIn = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  /**
   * Navigate to Request Password
   * @author Amit Singh
   */
  navigateToRequestPassword() {
    this._router.navigate(['/auth/request-password']);
  }
}
