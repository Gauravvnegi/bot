import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';

@Injectable({ providedIn: 'root' })
export class FeedbackConfigResolver implements Resolve<any> {
  constructor(private _feedbackService: FeedbackService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this._feedbackService.getFeedbackConfig();
  }
}
