import { Component, OnInit } from '@angular/core';
import { AuthService } from 'apps/admin/src/app/core/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'hospitality-bot-create-with-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.initCookiesForPlatform();
  }

  initCookiesForPlatform() {
    const keys = {
      authorizationToken: this._authService.getTokenByName('x-authorization'),
      accessToken: this._authService.getTokenByName('x-access-token'),
      refreshToken: this._authService.getTokenByName('x-refresh-authorization'),
      accessRefreshToken: this._authService.getTokenByName(
        'x-access-refresh-token'
      ),
      user: JSON.stringify({
        id: '52b3ea00-6058-4fad-b7f5-a119d47e6f25',
        firstName: 'Ajay',
        email: 'abc@gmail.com',
      }),
    };

    Object.entries(keys).forEach(([name, value]) => {
      this.cookieService.set(name, value, {
        sameSite: 'None',
        secure: true,
        path: '/',
        domain: 'botshot.ai',
      });
    });
  }
}
