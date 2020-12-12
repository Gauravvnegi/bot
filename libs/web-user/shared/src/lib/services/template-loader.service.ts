import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TemplateLoaderService {
  isTemplateLoading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
}
