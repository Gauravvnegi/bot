import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { DaterangeComponent } from './containers/daterange/daterange.component';
import { Daterangepicker } from 'ng2-daterangepicker';
// import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { ProfileDropdownComponent } from './containers/profile-dropdown/profile-dropdown.component';
import { FooterComponent } from './containers/footer/footer.component';
import { SearchBarComponent } from './containers/search-bar/search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    Daterangepicker,
    RouterModule,
    InputTextModule,
    DropdownModule,
    SharedMaterialModule,
  ],
  declarations: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
  ],
  exports: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
  ],
})
export class ThemeModule {}
