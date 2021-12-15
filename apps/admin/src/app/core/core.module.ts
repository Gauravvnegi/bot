import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@hospitality-bot/admin/environment';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModule } from './auth/auth.module';
import systemInterceptors from './configs/interceptor';
import getTranslationConfigs from './configs/translate';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    AuthModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    TranslateModule.forRoot(getTranslationConfigs([HttpClient])),
  ],
  providers: [...systemInterceptors],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
}
