import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';

@Injectable({ providedIn: 'root' })
export class UserDetailResolver implements Resolve<any> {
  constructor(private _userDetailService: UserDetailService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this._userDetailService.getUserDetailsById(
      this._userDetailService.getLoggedInUserid()
    );
  }
}
