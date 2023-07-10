import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AuthService } from 'apps/admin/src/app/core/auth/services/auth.service';
import { TokenUpdateService } from 'apps/admin/src/app/core/theme/src/lib/services/token-update.service';
import {
  ManageSiteListResponse,
  ManageSiteResponse,
} from 'libs/admin/manage-sites/src/lib/types/response.type';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { tokensConfig } from '../constants/common';
import { CookiesData } from '../types/user.type';
import { HotelDetailService } from './hotel-detail.service';
import { UserService } from './user-detail.service';

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
    private hotelDetailsService: HotelDetailService,
    private globalFilterService: GlobalFilterService
  ) {}

  initCookiesForPlatform() {
    const entityId =
      this.globalFilterService.entityId ??
      localStorage.getItem(tokensConfig.entityId);
    const siteId =
      this.hotelDetailsService.siteId ?? this.hotelDetailsService.getSiteId();

    if (!entityId) {
      this.$isPlatformCookiesLoaded.next(false);
      return;
    }

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
      entityId: entityId,
      siteId: siteId,
      brandId: this.hotelDetailsService.brandId,
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
    this.hotelAccessData = data?.records;
  }

  /**
   * @function initPlatformChange Change cookies as per hotel Selected
   * @param siteId Site ID
   * @param redirectUrl Redirect url if need to redirect
   */
  initPlatformChange(siteId: string, redirectUrl?: string) {
    const currentSite = this.hotelDetailsService.sites.find(
      (item) => item.id === siteId
    );

    const brands = currentSite?.brands;
    if (brands?.length) {
      // finding the brand which has hotel
      const currentBrand = brands.find((item) => !!item.entities?.length);
      const hotels = currentBrand?.entities;

      if (hotels.length) {
        const entityId = hotels[0].id;

        this.tokenUpdateService.getUpdatedToken(entityId).subscribe(
          (response) => {
            const key = Object.keys(response)[0];
            const hotelBasedToken = { key, value: response[key] };
            if (hotelBasedToken.key) {
              this.hotelDetailsService.updateBusinessSession(
                {
                  [tokensConfig.accessToken]: hotelBasedToken.value,
                  [tokensConfig.entityId]: entityId,
                  [tokensConfig.brandId]: currentBrand.id,
                  [tokensConfig.siteId]: currentSite.id,
                },
                redirectUrl
              );
            } else
              this.snackbarService.openSnackBarAsText(
                'Do not have access to the site.'
              );
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          }
        );
      } else {
        this.snackbarService.openSnackBarAsText(
          'There are no hotels registered with this site.'
        );
      }
    } else {
      this.snackbarService.openSnackBarAsText(
        'There are no brands associated with this website.'
      );
    }
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
