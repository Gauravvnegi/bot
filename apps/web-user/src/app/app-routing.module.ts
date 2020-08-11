import { environment } from '../environments/environment';

import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
import { HomeComponent } from './core/container/home/home.component';
import { sharedAuthRoutes } from '@hospitality-bot/web-user/template-renderer';

const appRoutes: Route[] = [{ path: '', children: sharedAuthRoutes }];

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
