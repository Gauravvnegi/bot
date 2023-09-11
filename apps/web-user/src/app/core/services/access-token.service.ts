import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TokensConfig } from '../types/common.types';

@Injectable({ providedIn: 'root' })
export class AccessTokenService {
  private _accessToken: string;
  private _entityId: string;
  _accessToken$ = new Subject<TokensConfig>();

  setAccessToken(accessToken: string, entityId: string) {
    this._accessToken$.next({ accessToken, entityId });
    this._accessToken = accessToken;
    this._entityId = entityId;
  }

  getAccessToken(): TokensConfig {
    return {
      accessToken: this._accessToken,
      entityId: this._entityId,
    };
  }
}
