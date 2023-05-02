import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { routes } from 'libs/admin/shared/src/index';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { layoutConfig, UserDropdown } from '../../constants/layout';
import { FirebaseMessagingService } from '../../services/messaging.service';

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
    private cookieService: CookieService
  ) {
    this.onManageSite = this._router.url.includes('manage-sites');
    this.items = layoutConfig.profile.filter(
      (item) => !(item.value === UserDropdown.MANAGE_SITES && this.onManageSite)
    );
  }

  ngOnInit(): void {}

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
      this._router.navigate([
        `/pages/${routes.RoleAndPermission}/manage-profile`,
      ]);
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
