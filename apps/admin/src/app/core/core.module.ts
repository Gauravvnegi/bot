import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@hospitality-bot/admin/environment';
import { AuthModule } from './auth/auth.module';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { TimezoneInterceptor } from './interceptors/timezone.interceptor';
import { TokenRetievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ProgressSpinnerInterceptor } from './theme/src/lib/interceptor/progress-spinner.interceptor';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    AuthModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    {
      provide: 'BASE_URL',
      useValue: environment.base_url,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimezoneInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRetievalInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressSpinnerInterceptor,
      multi: true,
    },
  ],
  exports: [],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
