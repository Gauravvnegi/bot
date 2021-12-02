import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
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

  /**
   * Request Password Form Initialization
   * @author Amit Singh
   */
  initRequestForm() {
    this.requestPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
    });
  }

  /**
   * Request Password
   * @returns null
   * @author Amit Singh
   */
  requestPassword() {
    if (!this.requestPasswordForm.valid) {
      return;
    }
    const email = this.emailFC.value ?? ''.trim();
    this._authService.forgotPassword(email).subscribe(
      (response) => {
        this.isEmailSent = response.status ?? false;
        this._snackbarService.openSnackBarAsText(response.message, '', {
          panelClass: 'success',
        });
        this._router.navigate(['/auth/resend-password']);
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message ?? '');
      }
    );
  }

  /**
   * Navigate to Login Page
   * @author Amit Singh
   */
  navigateToLogin() {
    this._router.navigate(['/auth']);
  }

  /**
   * Returns email form-control
   */
  get emailFC(): FormControl {
    return this.requestPasswordForm.get('email') as FormControl;
  }
}
