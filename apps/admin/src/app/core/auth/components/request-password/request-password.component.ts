import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Regex } from 'libs/shared/constants/regex';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  initRequestForm() {
    this.requestPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
    });
  }

  requestPassword() {
    if (!this.requestPasswordForm.valid) {
      return;
    }
    const email = this.requestPasswordForm.get('email').value;
    this._authService.forgotPassword(email).subscribe(
      (response) => {
        this.isEmailSent = response.status;
        this._snackbarService.openSnackBarAsText(response.message, '', {
          panelClass: 'success',
        });
        this._router.navigate(['/auth/resend-password']);
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
