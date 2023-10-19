import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';

@Injectable({ providedIn: 'root' })
export class MessageTabService extends ApiService {
  tabList$ = new BehaviorSubject([]);
  selectedTabMenu$ = new BehaviorSubject(0);

  registerFirebaseMessage(config, data) {
    return this.post(
      // `/api/v1/hotel/${config.entityId}/user/${config.userId}/device`,
      `/api/v1/user/${config.userId}/device`,
      data
    );
  }
}
