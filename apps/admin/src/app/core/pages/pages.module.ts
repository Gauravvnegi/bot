import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './containers/pages/pages.component';
import { PagesRoutingModule } from './pages.routing.module';
import { ThemeModule } from '../theme/src';

@NgModule({
  declarations: [PagesComponent],
  imports: [CommonModule, ThemeModule, PagesRoutingModule],
})
export class PagesModule {}
