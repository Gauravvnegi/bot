import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenRetievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ProgressSpinnerInterceptor } from './theme/src/lib/interceptor/progress-spinner.interceptor';
import { environment } from '@hospitality-bot/admin/environment';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { TimezoneInterceptor } from './interceptors/timezone.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {
      prefix: `./assets/i18n/auth/`,
      suffix: '.json',
    },
    { prefix: './assets/i18n/core/', suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    AuthModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
