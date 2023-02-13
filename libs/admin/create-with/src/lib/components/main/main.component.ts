import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserConfig, UserService } from '@hospitality-bot/admin/shared';
import { AuthService } from 'apps/admin/src/app/core/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { CreateWithService } from '../../services/create-with.service';

@Component({
  selector: 'hospitality-bot-create-with-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  adminDetails: UserConfig;
  $subscription = new Subscription();

  constructor(
    private _authService: AuthService,
    private cookieService: CookieService,
    private userService: UserService,
    private createWithService: CreateWithService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    const userId = this._authService.getTokenByName('x-userId');

    this.$subscription.add(
      this.userService.getUserDetailsById(userId).subscribe((data) => {
        this.adminDetails = new UserConfig().deserialize(data);
        this.initCookiesForPlatform();
      })
    );
  }

  initCookiesForPlatform() {
    const keys = {
      accessToken: this._authService.getTokenByName('x-access-token'),
      accessRefreshToken: this._authService.getTokenByName(
        'x-access-refresh-token'
      ),
      user: JSON.stringify({
        id: this.adminDetails.id,
        firstName: this.adminDetails.firstName,
        email: this.adminDetails.email,
      }),
      'x-userId': this._authService.getTokenByName('x-userId'),
      websiteUrl: 'dev.createwith.io',
      hotelId: this.adminDetails.branchName,
    };

    Object.entries(keys).forEach(([name, value]) => {
      this.cookieService.set(name, value, {
        sameSite: 'None',
        secure: true,
        path: '/',
        domain: 'botshot.ai',
      });
    });

    this.createWithService.$isCookiesLoaded.next(true);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
