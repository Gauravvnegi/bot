import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
// import {
//   TokenInterceptor,
//   LogResponseInterceptor
// } from '../../../../../libs/shared/interceptors/src';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { AuthModule } from './auth/auth.module';
import { SharedMaterialModule } from 'libs/shared/material/src';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedMaterialModule, AuthModule, RouterModule],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
