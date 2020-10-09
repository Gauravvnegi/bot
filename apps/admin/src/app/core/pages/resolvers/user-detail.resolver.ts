import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';

@Injectable({ providedIn: 'root' })
export class UserDetailResolver implements Resolve<any> {
  constructor(
    private _userDetailService: UserDetailService,
    private _router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this._userDetailService.getLoggedInUserid()) {
      this._router.navigate(['/auth']);
    }
    return this._userDetailService.getUserDetailsById(
      this._userDetailService.getLoggedInUserid()
    );
  }
}
