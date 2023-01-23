import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../theme/src';
import { PagesRoutingModule } from './pages.routing.module';

import { PagesComponent } from './containers/pages/pages.component';
import { TemporaryRedirectPageComponent } from './containers/trp/temporary-redirect-page/temporary-redirect-page.component';
@NgModule({
  declarations: [PagesComponent, TemporaryRedirectPageComponent],
  imports: [CommonModule, ThemeModule, PagesRoutingModule],
})
export class PagesModule {}
