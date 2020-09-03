import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { DaterangeComponent } from './containers/daterange/daterange.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { SharedMaterialModule } from 'libs/shared/material/src';
// import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    Daterangepicker,
    RouterModule,
    InputTextModule,
    DropdownModule,
  ],
  declarations: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
  ],
  exports: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
  ],
})
export class ThemeModule {}
