import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateLoaderService {
  isTemplateLoading$ = new BehaviorSubject(true);
  constructor() {}
}
