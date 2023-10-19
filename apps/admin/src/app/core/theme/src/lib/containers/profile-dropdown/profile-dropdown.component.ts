import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import {
  HotelDetailService,
  ModuleNames,
  routes,
} from 'libs/admin/shared/src/index';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { layoutConfig, UserDropdown } from '../../constants/layout';
import { FirebaseMessagingService } from '../../services/messaging.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { RoutesConfigService } from '../../services/routes-config.service';

@Component({
  selector: 'admin-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
  items = [];
  onManageSite = false;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    public userService: UserService,
    private firebaseMessagingService: FirebaseMessagingService,
    private cookieService: CookieService,
    private hotelDetailsService: HotelDetailService,
    private subscriptionPlanService: SubscriptionPlanService,
    private routesConfigService: RoutesConfigService
  ) {
    this.onManageSite = this._router.url.includes('manage-sites');
  }

  ngOnInit(): void {
    const isSiteAvailable = !!this.hotelDetailsService.sites?.length;

    const isCreateWithSubscribed =
      !this.onManageSite &&
      this.subscriptionPlanService.checkProductSubscription(
        ModuleNames.CREATE_WITH
      );

    const isRolesAndPermissionSubscribed =
      this.onManageSite ||
      this.subscriptionPlanService?.checkModuleSubscription(
        ModuleNames.ROLES_AND_PERMISSION
      );

    this.items = layoutConfig.profile.filter((item) => {
      if (
        // filtering out the manage site - either on mange site or sites not available or createWith not subscribed
        (item.value === UserDropdown.MANAGE_SITES &&
          (this.onManageSite || !isSiteAvailable || !isCreateWithSubscribed)) ||
        // filtering out manage profile if not subscribed
        (item.value === UserDropdown.PROFILE && !isRolesAndPermissionSubscribed)
      ) {
        return false;
      }
      return true;
    });
  }

  profileAction(event) {
    const itemType = event;

    switch (itemType) {
      case UserDropdown.PROFILE:
        this.displayProfile();
        break;
      case UserDropdown.LOGOUT:
        this.logoutUser();
        break;
      case UserDropdown.MANAGE_SITES:
        this.manageSites();
      default:
        return;
    }
  }

  displayProfile() {
    if (this.onManageSite) {
      this._router.navigate([`/dashboard/manage-sites/user-profile`]);
    } else {
      this.routesConfigService.navigate({
        isRespectiveToProduct: this.subscriptionPlanService.hasViewUserPermission(
          { name: this.routesConfigService.productName, type: 'product' }
        ),
        subModuleName: ModuleNames.ROLES_AND_PERMISSION,
        moduleName: ModuleNames.SETTINGS,
      });
    }
  }

  logoutUser() {
    this._authService
      .logout(this.userService.getLoggedInUserId())
      .subscribe(() => {
        this.firebaseMessagingService.destroySubscription();
        this._authService.clearToken();
        this._authService.deletePlatformRefererTokens(this.cookieService);
        location.reload();
      });
  }

  manageSites() {
    this._router.navigate([`/dashboard/manage-sites`]);
  }
}
