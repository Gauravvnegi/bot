import { Injectable } from '@angular/core';
import { EntitySubType, EntityType } from '@hospitality-bot/admin/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReservationTableValue } from '../constants/reservation-table';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  outletIds = [];
  public selectedEntity = new BehaviorSubject<EntityType>(EntityType.HOTEL);
  getSelectedEntity(): Observable<EntityType> {
    return this.selectedEntity.asObservable().pipe(distinctUntilChanged());
  }
  public selectedOutlet = new BehaviorSubject<EntitySubType>(
    EntitySubType.ROOM_TYPE
  );
  getSelectedOutlet(): Observable<EntitySubType> {
    return this.selectedOutlet.asObservable().pipe(distinctUntilChanged());
  }

  type: string;
  $entityTypeChange = new BehaviorSubject({ status: false, type: '' });
  $feedbackType = new BehaviorSubject('');

  reservationDate = new BehaviorSubject<Date>(null);
  selectedTab = ReservationTableValue.ALL;
  enableAccordion: boolean = false;
}
