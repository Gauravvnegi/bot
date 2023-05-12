import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Regex, UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { authConstants } from '../../constants/auth';
import { AuthService } from '../../services/auth.service';

/**
 * @class Login Component
 */
@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isSigningIn = false;
  platformReferer: string;
  platformAccessToken: string;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _snackbarService: SnackBarService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initLoginForm();
  }

  ngOnInit(): void {
    this.checkForAccessToken();
    if (this._authService.isAuthenticated()) {
      this._router.navigate([`/pages`]);
    }
  }

  checkForAccessToken() {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['platformReferer'] && params['pat']) {
        this.platformReferer = decodeURIComponent(params['platformReferer']);
        this.platformAccessToken = decodeURIComponent(params['pat']);
        this.autoLoginWithAccessToken();
      }
    });
  }

  autoLoginWithAccessToken() {
    const data = {
      platformReferer: this.platformReferer,
      platformAccessToken: this.platformAccessToken,
    };

    this._authService.verifyPlatformAccessToken(data).subscribe((response) => {
      if (this.platformReferer == 'CREATE_WITH') {
        this._router.navigate(['/pages/create-with']);
      }
    });
  }

  /**
   * @function initLoginForm To initialize login form.
   */
  initLoginForm(): void {
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
   * @function login To login to the admin panel.
   */
  login(): void {
    if (!this.loginForm.valid) {
      return;
    }
    this.isSigningIn = true;
    const data = this.loginForm.getRawValue();
    data.email = data.email?.toLowerCase().trim();
    data.password = data.password?.trim();
    this._authService.login(data).subscribe(
      (response) => {
        const hasSites = !!response.sites?.length;
        const hasBrands = response.hotelAccess?.brands?.length;
        if (hasSites || hasBrands) {
          this._router.navigate([`/pages`]);
        } else {
          this._router.navigate([`/dashboard`]);
        }
      },
      ({ error }) => {
        this.isSigningIn = false;
      }
    );
  }

  /**
   * @function navigateToRequestPassword To navigate to the request password route.
   */
  navigateToRequestPassword(): void {
    this._router.navigate(['/auth/request-password'], {
      state: { email: this.loginForm.get('email')?.value.toLowerCase().trim() },
    });
  }
}
