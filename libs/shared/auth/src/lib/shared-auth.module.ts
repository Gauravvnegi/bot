import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './container/login/login.component';
import { LoginFormComponent } from './presentational/login-form/login-form.component';

export const sharedAuthRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [LoginComponent, LoginFormComponent],
})
export class SharedAuthModule {}
