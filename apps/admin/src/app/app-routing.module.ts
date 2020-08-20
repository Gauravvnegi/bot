import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { HomeComponent } from './core/container/home/home.component';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
import { ProfileComponentComponent } from './core/container/profile-component/profile-component.component';
import { PriceTableComponent } from './core/container/price-table/price-table.component';

const appRoutes: Route[] = [{ path: '', component: HomeComponent  , children:[
  {path: 'profile', component: ProfileComponentComponent},
  {path: 'components/price-table', component: PriceTableComponent},
]}];

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
