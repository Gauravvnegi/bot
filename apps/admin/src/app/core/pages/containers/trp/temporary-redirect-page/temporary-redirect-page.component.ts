import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleNames, UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AuthService } from '../../../../auth/services/auth.service';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'admin-temporary-redirect-page',
  templateUrl: './temporary-redirect-page.component.html',
  styleUrls: ['./temporary-redirect-page.component.scss'],
})
export class TemporaryRedirectPageComponent implements OnInit {
  platformReferer: string;
  platformAccessToken: string;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _snackbarService: SnackBarService,
    private _activatedRoute: ActivatedRoute,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.checkForAccessToken();
  }

  checkForAccessToken() {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params['platformReferer'] && params['pat']) {
        this.platformReferer = decodeURIComponent(params['platformReferer']);
        this.platformAccessToken = decodeURIComponent(params['pat']);
        this.autoLoginWithAccessToken();
      }
    });
  }

  autoLoginWithAccessToken() {
    const data = {
      platformReferer: this.platformReferer,
      platformAccessToken: this.platformAccessToken,
    };

    this._authService.verifyPlatformAccessToken(data).subscribe((response) => {
      // if (this.platformReferer == 'CREATE_WITH') {
      //   this._router.navigate(['/pages/create-with']);
      // }
      if (this.platformReferer == ModuleNames.CREATE_WITH) {
        const createWithRoute = this.routesConfigService.modulePathConfig[
          ModuleNames.CREATE_WITH
        ];
        this._router.navigate([createWithRoute ?? '/create-with']);
      }
    });
  }
}
