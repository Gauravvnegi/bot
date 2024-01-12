import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';
import { LoadingService } from '../theme/src/lib/services/loader.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject = new BehaviorSubject<any>(null);
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _router: Router,
    private loadingService: LoadingService,
    private cookieService: CookieService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (req.url.includes('refresh') || req.url.includes('login')) {
          console.log('Error occured in either login or refresh api');
          if (req.url.includes('refresh')) {
            //logout and redirect to login
            console.log(
              'Error occured in refresh token. So logout current user and redirecting to login'
            );
            this.logoutUser();
          }
          this.loadingService.close();

          return throwError(err);
        }

        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case

        if (err.status !== 401) {
          this.loadingService.close();
          return throwError(err);
        }

        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          console.log('Refresh token in progress');
          return this.refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap(() => {
              return next.handle(this.addAuthenticationToken(req));
            })
          );
        } else {
          if (!this._authService.isAuthenticated()) {
            this._router.navigate(['/auth']);
            this.loadingService.close();
            return throwError(err);
          }
          this.refreshTokenInProgress = true;
          console.log('call refresh token api to get new tokens');
          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          return this._authService
            .refreshAccessToken({
              'x-access-refresh-token': this._authService.getTokenByName(
                'x-access-refresh-token'
              ),
              'x-userId': this._authService.getTokenByName('x-userId'),
            })
            .pipe(
              switchMap((tokenObj: any) => {
                //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                // for the next time the token needs to be refreshed
                this.updateAccessToken(tokenObj);
                this.refreshTokenInProgress = false;
                const newRequest = this.addAuthenticationToken(req);
                this.refreshTokenSubject.next(tokenObj);
                return next.handle(newRequest);
              }),
              catchError((err) => {
                console.log('Refresh token api failed');
                this.refreshTokenInProgress = false;
                //   this.logoutUser();
                return throwError(err);
              })
            );
        }
      })
    );
  }

  addAuthenticationToken(request) {
    // Get access token from Local Storage
    const isAccessTokens =
      this._authService.getTokenByName('x-access-refresh-token') &&
      this._authService.getTokenByName('x-userId');
    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!isAccessTokens) {
      return request;
    }
    // We clone the request, because the original request is immutable

    return request.clone({
      setHeaders: {
        'x-access-token': this._authService.getTokenByName('x-access-token'),
        'x-userId': this._authService.getTokenByName('x-userId'),
      },
    });
  }

  logoutUser() {
    this._authService.logout(this._userService.getLoggedInUserId()).subscribe(
      (_) => {
        this._authService.clearToken();
        this._authService.deletePlatformRefererTokens(this.cookieService);
        this._router.navigate(['/auth']);
        this.loadingService?.close();
      },
      (error) => {
        this.loadingService?.close();
        this._authService.clearToken();
        this._router.navigate(['/auth']);
      }
    );
  }

  updateAccessToken(tokenConfig) {
    this._authService.setTokenByName(
      'x-access-token',
      tokenConfig['x-access-token']
    );
    if (tokenConfig['x-userId']) {
      this._authService.setTokenByName('x-userId', tokenConfig['x-userId']);
    }
  }
}
