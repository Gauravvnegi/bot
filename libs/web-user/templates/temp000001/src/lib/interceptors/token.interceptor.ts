import { SharedTokenInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';
import { AccessTokenService } from 'apps/web-user/src/app/core/services/access-token.service';

@Injectable()
export class TokenInterceptor extends SharedTokenInterceptor {
  constructor(private _accessTokenService: AccessTokenService) {
    super();
    this.setHeaderName('x-access-token');
    this.registerListener();
  }

  registerListener() {
    if (this._accessTokenService.getAccessToken()) {
      this.setTokenValue(this._accessTokenService.getAccessToken());
    }
  }
}
