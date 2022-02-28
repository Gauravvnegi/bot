import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { Regex } from '@hospitality-bot/shared';
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
        this._userService.setLoggedInUserId(response?.id);
        this._router.navigate(['/pages/dashboard']);
      },
      ({ error }) => {
        this.isSigningIn = false;
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
   * @function navigateToRequestPassword To navigate to the request password route.
   */
  navigateToRequestPassword(): void {
    this._router.navigate(['/auth/request-password'], {
      state: { email: this.loginForm.get('email')?.value.toLowerCase().trim() },
    });
  }
}
