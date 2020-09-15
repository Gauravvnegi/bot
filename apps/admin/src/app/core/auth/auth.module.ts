import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RequestPasswordComponent } from './components/request-password/request-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule, SnackBarService } from 'libs/shared/material/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ResendPasswordComponent } from './components/resend-password/resend-password.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    LogoutComponent,
    ResendPasswordComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule, 
    RouterModule.forRoot([])],
  exports: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    LogoutComponent,
  ],
  providers: [
    AuthService,
    SnackBarService
  ]
})
export class AuthModule {}
