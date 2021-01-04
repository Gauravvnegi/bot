import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Regex } from '../../../../../../../../libs/shared/constants/regex';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { UserDetailService } from '../../../../../../../../libs/admin/shared/src/lib/services/user-detail.service';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible = false;
  isSigningIn = false;
  dataSource = { id: '1234', token: 'token_xyz' };

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _userDetailService: UserDetailService,
    private _snackbarService: SnackBarService
  ) {
    this.initLoginForm();
  }

  ngOnInit(): void {}

  initLoginForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.isSigningIn = true;
    const data = this.loginForm.value;
    this._authService.login(data).subscribe(
      (response) => {
        this._userDetailService.setLoggedInUserId(response.id);
        this._router.navigate(['/pages/dashboard']);
      },
      (error) => {
        this.isSigningIn = false;
        this._snackbarService.openSnackBarAsText(error.error.message);
      }
    );
  }

  navigateToRequestPassword() {
    this._router.navigate(['/auth/request-password']);
  }
}
