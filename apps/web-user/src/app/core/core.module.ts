import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
// import {
//   TokenInterceptor,
//   LogResponseInterceptor
// } from '../../../../../libs/shared/interceptors/src';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';

@NgModule({
  imports: [CommonModule],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
