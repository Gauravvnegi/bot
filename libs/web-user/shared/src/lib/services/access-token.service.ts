import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AccessTokenService {
  private _accessToken: string;
  _accessToken$ = new Subject();

  setAccessToken(accessToken) {
    this._accessToken$.next(accessToken);
    this._accessToken = accessToken;
  }
}
