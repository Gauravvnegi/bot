import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageTabService {
  tabList$ = new BehaviorSubject([]);
  selectedTabMenu$ = new BehaviorSubject(0);

  constructor() {}
}
