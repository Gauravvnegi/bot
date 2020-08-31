import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { PreloadModulesStrategy } from './core/strategies/preload-modules.strategy';
import { LoginComponent } from './core/auth/components/login/login.component';
import { AuthGuard } from './core/guards/auth-guard';
import { AuthComponent } from './core/auth/components/auth/auth.component';
import { RegisterComponent } from './core/auth/components/register/register.component';
import { RequestPasswordComponent } from './core/auth/components/request-password/request-password.component';
import { LogoutComponent } from './core/auth/components/logout/logout.component';
import { ResetPasswordComponent } from './core/auth/components/reset-password/reset-password.component';

const appRoutes: Route[] = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'request-password',
        component: RequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
    ],
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./core/pages/pages.module').then((m) => m.PagesModule),
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
