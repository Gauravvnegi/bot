import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from 'libs/shared/material/src/lib/shared-material.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DropdownModule } from 'primeng/dropdown';
// import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { DaterangeComponent } from './containers/daterange/daterange.component';
import { FilterComponent } from './containers/filter/filter.component';
import { FooterComponent } from './containers/footer/footer.component';
import { LayoutOneComponent } from './containers/layouts/layout-one/layout-one.component';
import { MessageTabMenuComponent } from './containers/message-tab-menu/message-tab-menu.component';
import { NotificationPopupComponent } from './containers/notification-popup/notification-popup.component';
import { NotificationDetailComponent } from './containers/notification/notification-detail/notification-detail.component';
import { NotificationFilterComponent } from './containers/notification/notification-filter/notification-filter.component';
import { NotificationSettingsComponent } from './containers/notification/notification-settings/notification-settings.component';
import { NotificationComponent } from './containers/notification/notification.component';
import { OrientationPopupComponent } from './containers/orientation-popup/orientation-popup.component';
import { ProfileDropdownComponent } from './containers/profile-dropdown/profile-dropdown.component';
import { SearchBarComponent } from './containers/search-bar/search-bar.component';
import { SettingsComponent } from './containers/settings/settings.component';
import { SidenavExpandComponent } from './containers/sidenav/sidenav-expand/sidenav-expand.component';
import { SidenavComponent } from './containers/sidenav/sidenav.component';
import { ScrollPagination } from './directives/scroll-pagination.directive';

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
    SidenavExpandComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
    FilterComponent,
    OrientationPopupComponent,
    MessageTabMenuComponent,
    NotificationPopupComponent,
    NotificationComponent,
    NotificationSettingsComponent,
    NotificationFilterComponent,
    NotificationDetailComponent,
    ScrollPagination,
  ],
  providers: [CookieService],
  exports: [
    SidenavComponent,
    SidenavExpandComponent,
    LayoutOneComponent,
    SettingsComponent,
    DaterangeComponent,
    ProfileDropdownComponent,
    FooterComponent,
    SearchBarComponent,
    FilterComponent,
    MessageTabMenuComponent,
    NotificationPopupComponent,
    NotificationComponent,
    ScrollPagination,
  ],
})
export class ThemeModule {}
