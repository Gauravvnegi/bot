import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { environment } from '@hospitality-bot/web-user/environment';
import { AccessTokenService } from 'apps/web-user/src/app/core/services/access-token.service';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { TokenRetrievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    AccessTokenService,
    {
      provide: 'BASE_URL',
      useValue: environment.base_url,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRetrievalInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
