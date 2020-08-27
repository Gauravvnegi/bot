import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
import { ProfileComponentComponent } from './core/container/profile-component/profile-component.component';
import { PriceTableComponent } from './core/container/price-table/price-table.component';
import { LayoutOneComponent } from 'libs/shared/theme/src/lib/containers/layouts/layout-one/layout-one.component';
import { SettingsComponent } from 'libs/shared/theme/src/lib/containers/settings/settings.component';
import { LoginComponent } from './core/container/login/login.component';
import { AuthGuard } from './core/guards/auth-guard';

const appRoutes: Route[] = [
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutOneComponent,
    children: [
      { path: 'profile', component: ProfileComponentComponent },
      { path: 'components/price-table', component: PriceTableComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

/**
 * @description To enable/disable tracing of route disable the ${switchForRouteTrace}.
 */
const switchForRouteTrace = false;

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadModulesStrategy,
      enableTracing: switchForRouteTrace && !environment.production,
    }),
  ],
  exports: [RouterModule],
  providers: [PreloadModulesStrategy],
})
export class AppRoutingModule {}
