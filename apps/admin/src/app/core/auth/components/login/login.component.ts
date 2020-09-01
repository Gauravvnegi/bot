import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Regex } from '../../../../../../../../libs/shared/constants/regex';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isPasswordVisible = false;
  dataSource = {id:'1234', token:'token_xyz'};

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _snackbarService:SnackBarService
  ) {
    this.initLoginForm();
  }

  ngOnInit(): void {}

  initLoginForm(){
    this.loginForm = this._fb.group({
      email: ['', [
        Validators.required, 
        Validators.pattern(Regex.EMAIL_REGEX)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]],
    });
  }

  Login(){
    console.log(this.loginForm.getRawValue());
    of(this.dataSource)
    .pipe(delay(2000))
    .subscribe(()=>{
      this._router.navigate(['/pages']);
    },
    (error)=>{
      this._snackbarService.openSnackBarAsText('some error occured');
    })
  }

  navigateToForgotPassword(){
    this._router.navigate(['/auth/reset-password']);
  }
}
