import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HotelService extends ApiService {
  private _hotelConfig;
  private _currentJourney: string;
  private _entityId: string;
  titleConfig$ = new BehaviorSubject(null);

  getCurrentJourneyConfig() {
    return (
      (this.hotelConfig &&
        this.hotelConfig.journeys &&
        this.hotelConfig.journeys[this.currentJourney]) ||
      {}
    );
  }

  getHotelConfigById(entityId): Observable<any> {
    return this.get(`/api/v1/entity/${entityId}`);
  }

  get currentJourney(): string {
    return this._currentJourney;
  }

  set currentJourney(currentJourney: string) {
    this._currentJourney = currentJourney;
  }

  get hotelConfig() {
    return this._hotelConfig;
  }

  set hotelConfig(hotelConfig) {
    this._hotelConfig = hotelConfig;
  }

  get entityId(): string {
    return this._entityId || (this.hotelConfig && this._hotelConfig.id);
  }

  set entityId(entityId: string) {
    this._entityId = entityId;
  }

  get healthFormId(): string {
    return this._hotelConfig.healthFormId;
  }
}
