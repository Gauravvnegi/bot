import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable()
export class ParentFormService {
  parentFormValueAndValidity$ = new ReplaySubject(1);
}
