import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'admin-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  isPasswordVisible:boolean = false;
  dataSource = {id:'1234', token:'token_xyz'};

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _snackbarService:SnackBarService,
    private _authService: AuthService
  ) { 
    this.initResetForm();
  }

  ngOnInit(): void {
  }

  initResetForm(){
    this.resetPasswordForm = this._fb.group({
      password: ['', [
        Validators.required]],
      resetPassword: ['', [
        Validators.required]],
    },{
      validator: this._authService.matchPasswords('password', 'resetPassword')
    });
  }

  ResetPassword(){
    console.log(this.resetPasswordForm.getRawValue());
    of(this.dataSource)
    .pipe(delay(2000))
    .subscribe(()=>{
      this._snackbarService.openSnackBarAsText(
        'Reset password successful',
        '',
        { panelClass: 'success' }
      );
      this.navigateToLogin();
    },
    (error)=>{
      this._snackbarService.openSnackBarAsText('some error occured');
    })
  }

  navigateToLogin(){
    this._router.navigate(['/auth/login']);
  }

}
