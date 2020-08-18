import { SharedTokenInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';
import { AccessTokenService } from 'libs/web-user/shared/src/lib/services/access-token.service';

@Injectable()
export class TokenInterceptor extends SharedTokenInterceptor {
  constructor(private _accessTokenService: AccessTokenService) {
    super();
    this.setHeaderName('x-access-token');
    this.registerListener();
  }

  registerListener() {
    this._accessTokenService._accessToken$.subscribe((accessToken: string) => {
      this.setTokenValue(accessToken);
    });
  }
}
