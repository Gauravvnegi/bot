import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CreateWithService {
  $isCookiesLoaded = new BehaviorSubject(false);
}
