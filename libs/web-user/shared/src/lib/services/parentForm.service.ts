import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParentFormService {
  parentFormValueAndValidity$ = new ReplaySubject(1);
}
