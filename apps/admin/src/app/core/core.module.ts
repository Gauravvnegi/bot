import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@hospitality-bot/admin/environment';
import { TranslateModule } from '@ngx-translate/core';
import { getTranslationConfigs } from 'libs/admin/shared/src/lib/configs/translate';
import { AuthModule } from './auth/auth.module';
import systemInterceptors from './configs/interceptor';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';

@NgModule({
  declarations: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    TranslateModule.forRoot(
      getTranslationConfigs([HttpClient], ['core', 'auth', 'errors'])
    ),
  ],
  providers: [...systemInterceptors],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
