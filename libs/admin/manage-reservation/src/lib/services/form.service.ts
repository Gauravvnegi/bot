import { Injectable } from '@angular/core';
import { EntitySubType, EntityType } from '@hospitality-bot/admin/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ReservationTableValue } from '../constants/reservation-table';
import { SelectedEntity } from '../types/reservation.type';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  outletIds = [];

  public selectedEntity = new BehaviorSubject<SelectedEntity>(null);
  getSelectedEntity(): Observable<SelectedEntity> {
    return this.selectedEntity.asObservable().pipe(distinctUntilChanged());
  }

  type: string;
  $entityTypeChange = new BehaviorSubject({ status: false, type: '' });
  $feedbackType = new BehaviorSubject('');

  reservationDate = new BehaviorSubject<Date>(null);
  reservationDateAndTime = new BehaviorSubject<number>(0);
  getReservationDateAndTime(): Observable<Date> {
    return this.reservationDate.asObservable();
  }
  selectedTab = ReservationTableValue.ALL;
  enableAccordion: boolean = false;

  //  Booking Summary Props
  price = new BehaviorSubject(0);
  discountedPrice = new BehaviorSubject(0);
}
