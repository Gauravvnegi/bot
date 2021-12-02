import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RequestPasswordComponent } from './components/request-password/request-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RouterModule } from '@angular/router';
import {
  SharedMaterialModule,
  SnackBarService,
} from 'libs/shared/material/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ResendPasswordComponent } from './components/resend-password/resend-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { ValidatorService } from './services/validator-service';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
    ResendPasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    SharedMaterialModule,
    RouterModule,
  ],
  exports: [
    AuthComponent,
    LoginComponent,
    RequestPasswordComponent,
    ResetPasswordComponent,
  ],
  providers: [AuthService, SnackBarService, ValidatorService],
})
export class AuthModule {}
