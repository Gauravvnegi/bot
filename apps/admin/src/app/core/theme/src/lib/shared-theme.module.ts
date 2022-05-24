import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DropdownModule } from 'primeng/dropdown';
// import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DaterangeComponent } from './containers/daterange/daterange.component';
import { FilterComponent } from './containers/filter/filter.component';
import { FooterComponent } from './containers/footer/footer.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { MessageTabMenuComponent } from './containers/message-tab-menu/message-tab-menu.component';
import { NotificationComponent } from './containers/notification/notification.component';
import { OrientationPopupComponent } from './containers/orientation-popup/orientation-popup.component';
import { ProfileDropdownComponent } from './containers/profile-dropdown/profile-dropdown.component';
import { SearchBarComponent } from './containers/search-bar/search-bar.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    RouterModule,
    InputTextModule,
    DropdownModule,
    SharedMaterialModule,
    TabViewModule,
    AngularFireMessagingModule,
  ],
  declarations: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
    FilterComponent,
    OrientationPopupComponent,
    MessageTabMenuComponent,
    NotificationComponent,
  ],
  exports: [
    SidenavComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
    FilterComponent,
    MessageTabMenuComponent,
    NotificationComponent,
  ],
})
export class ThemeModule {}
