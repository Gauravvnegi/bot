import { Injectable } from '@angular/core';
import { MessageSnackbarConfig } from 'libs/shared/material/src/lib/types/snackbar.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressSpinnerService {
  isProgressSpinnerVisible = false;
  $snackbarChange = new BehaviorSubject<MessageSnackbarConfig>(undefined);
}
