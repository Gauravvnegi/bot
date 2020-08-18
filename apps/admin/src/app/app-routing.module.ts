import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { HomeComponent } from './core/container/home/home.component';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';

const appRoutes: Route[] = [{ path: '', component: HomeComponent }];

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
