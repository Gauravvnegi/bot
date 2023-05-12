import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CookiesData,
  Tokens,
  UserResponse,
} from '@hospitality-bot/admin/shared';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import {
  ChangePasswordParam,
  ForgotPasswordParam,
  LoginParam,
  RefreshTokenParam,
} from '../types/auth.type';

/**
 * @class To manage all the api call for authentication.
 */
@Injectable()
export class AuthService extends ApiService {
  tokens: Tokens[] = [
    'x-access-token',
    'x-access-refresh-token',
    'x-userId',
    'x-siteId',
    'x-brandId',
    'x-hotelId',
  ];

  /**
   * @function login To login the user.
   * @param loginParams Data for login.
    font-weight: $medium;
   * @returns An Observable with the user data.
   */
  login(loginParams: LoginParam): Observable<UserResponse> {
    return this.post(`/api/v1/user/login`, loginParams);
  }

  /**
   * @function forgotPassword To raise a forgot password request.
   * @param forgotPasswordParams The email of the user to change password.
   * @returns An Observable to be subscribed.
   */
  forgotPassword(forgotPasswordParams: ForgotPasswordParam): Observable<any> {
    return this.put(`/api/v1/user/forgot-password`, forgotPasswordParams);
  }

  /**
   * @function To change password with a new password.
   * @param changePasswordParam The data to change password for a user.
   * @returns An observable with user information.
   */
  changePassword(changePasswordParam: ChangePasswordParam): Observable<any> {
    return this.put(`/api/v1/user/change-password`, changePasswordParam);
  }

  /**
   * @function refreshAccessToken To refresh the existing set of tokens.
   * @param config The refresh token data.
   * @returns An Observable wit new set of tokens.
   */
  refreshAccessToken(refreshTokenParam: RefreshTokenParam): Observable<any> {
    return this.post(`/api/v1/user/tokens/refresh`, refreshTokenParam);
  }

  /**
   * @function getTokenByName To get a token by name from local storage.
   * @param tokenName The token name by which get the token.
   * @returns The token value.
   */
  getTokenByName(tokenName: string) {
    return localStorage.getItem(tokenName);
  }

  /**
   * @function isAuthenticated To check whether we are logged in or not.
   * @returns The user is authenticated or not.
   */
  isAuthenticated(): boolean {
    const xAccessToken = this.getTokenByName('x-access-token');
    const xUserIdToken = this.getTokenByName('x-userId');

    return !!xAccessToken && !!xUserIdToken;
  }

  /**
   * @function setTokenByName To set a value in local storage.
   * @param tokenName The token name by which a value will be set in local storage.
   * @param value The token value to be stored in local storage.
   */
  setTokenByName(tokenName: string, value: string) {
    localStorage.setItem(tokenName, value);
  }

  /**
   * Setting tokens in local Storage
   * @param headers Http Headers
   */
  setTokens(headers: HttpHeaders) {
    this.tokens.forEach((tokenName) => {
      const tokenValue = headers.get(tokenName);
      if (tokenValue) localStorage.setItem(tokenName, tokenValue);
    });
  }

  /**
   * @function clearToken To clear the auth tokens from localStorage.
   */
  clearToken() {
    this.tokens.forEach((token) => localStorage.removeItem(token));
  }

  /**
   * @function logout To logout a user from the system.
   * @param userId User id of the user to logout.
   * @returns An observable to subscribe.
   */
  logout(userId: string): Observable<any> {
    return this.post(`/api/v1/user/${userId}/logout`, {});
  }

  verifyPlatformAccessToken(data): Observable<any> {
    return this.post(`/api/v1/user/verify-token`, data);
  }

  deletePlatformRefererTokens(cookieService) {
    const tokensToRemove: (keyof CookiesData)[] = [
      'accessToken',
      'accessRefreshToken',
      'user',
      'x-userId',
      'hotelId',
      'siteId',
      'brandId',
    ];

    tokensToRemove.forEach((token) =>
      cookieService.set(token, null, {
        sameSite: 'None',
        secure: true,
        path: '/',
        domain: 'botshot.ai',
        expires: -1,
      })
    );
  }
}
