import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedThemeModule } from '@hospitality-bot/shared/theme';
import { PriceTableComponent } from './container/price-table/price-table.component';
import { ProfileComponentComponent } from './container/profile-component/profile-component.component';
import { ROUTES } from './configs/sidebar-routes.config';
// import {
//   TokenInterceptor,
//   LogResponseInterceptor
// } from '../../../../../libs/shared/interceptors/src';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';

const customConfig = {
  ROUTES: ROUTES,
};

@NgModule({
  declarations: [ProfileComponentComponent, PriceTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedThemeModule.forRoot(customConfig),
  ],
  providers: [],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
