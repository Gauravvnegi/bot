import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
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
import { MainComponent } from './container/main/main.component';
import { AuthModule } from './auth/auth.module';
import { SharedMaterialModule } from 'libs/shared/material/src';

const customConfig = {
  ROUTES: ROUTES,
  sidenav: {
    list_item_colour: '#9c27b0',
    background_colour: '#000',
    background_image: 'assets/sidebar-3.jpg',
  },
};

@NgModule({
  declarations: [ProfileComponentComponent, PriceTableComponent, MainComponent],
  imports: [
    CommonModule,
    SharedMaterialModule,
    AuthModule,
    RouterModule,
    SharedThemeModule.forRoot(customConfig),
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
