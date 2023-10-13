import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ReportsService extends ApiService {
  showMenu = new BehaviorSubject(true);

  toggleMenu() {
    this.showMenu.next(!this.showMenu.value);
  }
}
