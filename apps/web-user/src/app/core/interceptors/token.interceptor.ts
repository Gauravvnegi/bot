import { SharedTokenInterceptor } from 'libs/shared/interceptors/src';
import { Injectable } from '@angular/core';
import { AccessTokenService } from 'apps/web-user/src/app/core/services/access-token.service';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor extends SharedTokenInterceptor {
  constructor(private _accessTokenService: AccessTokenService) {
    super();
    this.setHeaderName('x-access-token');
    // this.setTokenValue('test-token');
    this.registerListener();
  }

  registerListener() {
    this._accessTokenService._accessToken$.subscribe((accessToken: string) => {
      if (accessToken) {
        this.setTokenValue(accessToken);
      }
    });
  }
}
