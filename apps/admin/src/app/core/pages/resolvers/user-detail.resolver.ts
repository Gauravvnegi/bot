import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { Observable } from 'rxjs';
import { LoadingService } from '../../theme/src/lib/services/loader.service';

@Injectable({ providedIn: 'root' })
export class UserDetailResolver implements Resolve<any> {
  constructor(
    private userService: UserService,
    private _router: Router,

    private loadingService: LoadingService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this.userService.getLoggedInUserid()) {
      this._router.navigate(['/auth']);
    }
    this.loadingService.open();
    return this.userService.getUserDetailsById(
      this.userService.getLoggedInUserid()
    );
  }
}
