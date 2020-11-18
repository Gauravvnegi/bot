import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
// import {
//   TokenInterceptor,
//   LogResponseInterceptor
// } from '../../../../../libs/shared/interceptors/src';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { environment } from '@hospitality-bot/web-user/environment';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: 'BASE_URL',
      useValue: environment.base_url,
    },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
