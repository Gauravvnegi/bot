import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { ProgressSpinnerService } from '../theme/src/lib/services/progress-spinner.service';

@Injectable({ providedIn: 'root' })
export class CanActivateGuard implements CanActivate {
  constructor(private progressSpinnerService: ProgressSpinnerService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // closing the loader for the cancelled api calls on route change
    this.progressSpinnerService.isProgressSpinnerVisible = false;
    return true;
  }
}
