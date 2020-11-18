import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressSpinnerService {
  isProgressSpinnerVisible: boolean = false;
}
