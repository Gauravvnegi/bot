import { Injectable } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AuthService } from 'apps/admin/src/app/core/auth/services/auth.service';
import { TokenUpdateService } from 'apps/admin/src/app/core/theme/src/lib/services/token-update.service';
import {
  ManageSiteListResponse,
  ManageSiteResponse,
} from 'libs/admin/manage-sites/src/lib/types/response.type';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user-detail.service';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { CookiesData } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class CookiesSettingsService {
  $isPlatformCookiesLoaded = new BehaviorSubject(false);
  hotelAccessData: ManageSiteResponse[] = [];

  constructor(
    private _authService: AuthService,
    private userService: UserService,
    private cookieService: CookieService,
    private tokenUpdateService: TokenUpdateService,
    private snackbarService: SnackBarService,
    private router: Router,
    private globalFilterService: GlobalFilterService
  ) {}

  initCookiesForPlatform() {
    const hotelId =
      this.globalFilterService.hotelId ?? localStorage.getItem('hotelId');

    if (!hotelId) {
      this.$isPlatformCookiesLoaded.next(false);
      return;
    }

    const currentHotel = this.hotelAccessData.find(
      (item) => (item.id = hotelId)
    );

    const userDetails = this.userService.userDetails;
    const keys: CookiesData = {
      accessToken: this._authService.getTokenByName('x-access-token'),
      accessRefreshToken: this._authService.getTokenByName(
        'x-access-refresh-token'
      ),
      user: JSON.stringify({
        id: userDetails.id,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
      }),
      'x-userId': this._authService.getTokenByName('x-userId'),
      hotelId: hotelId,
    };

    Object.entries(keys).forEach(([name, value]) => {
      this.cookieService.set(name, value, {
        sameSite: 'None',
        secure: true,
        path: '/',
        domain: 'botshot.ai',
      });
    });

    this.$isPlatformCookiesLoaded.next(true);
  }

  initHotelAccessDetails(data: ManageSiteListResponse) {
    this.hotelAccessData = data.records;
  }

  /**
   * @function initPlatformChange Change cookies as per hotel Selected
   * @param hotelId Hotel ID
   * @param redirectUrl Redirect url if need to redirect
   */
  initPlatformChange(hotelId: string, redirectUrl?: string) {
    this.tokenUpdateService.getUpdatedToken(hotelId).subscribe(
      (response) => {
        const key = Object.keys(response)[0];
        const hotelBasedToken = { key, value: response[key] };
        if (hotelBasedToken.key) {
          localStorage.setItem(hotelBasedToken.key, hotelBasedToken.value);
          localStorage.setItem('hotelId', hotelId);

          if (redirectUrl) {
            this.router.navigate([redirectUrl]);
          } else {
            window.location.reload();
          }
        } else
          this.snackbarService.openSnackBarAsText(
            'Did not receive the access token'
          );
      },
      ({ error }) => {
        this.snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  /**
   * To remove extra padding and footer for iframe
   */
  afterEmbeddedFrameView() {
    document
      .getElementById('main-router')
      ?.setAttribute('style', 'padding:0px');

    document
      .getElementById('main-footer')
      ?.setAttribute('style', 'display:none');
  }

  onEmbeddedFrameViewDestroy() {
    document.getElementById('main-router')?.removeAttribute('style');
    document.getElementById('main-footer')?.removeAttribute('style');
  }
}
