import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HotelService extends ApiService {
  private _hotelConfig;
  private _currentJourney;
  private _hotelId;

  getCurrentJourneyConfig() {
    return this.hotelConfig && this.hotelConfig.journeys[this.currentJourney];
  }

  getHotelConfigById(hotelId): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}`);
  }

  get currentJourney() {
    return this._currentJourney;
  }

  set currentJourney(currentJourney) {
    this._currentJourney = currentJourney;
  }

  get hotelConfig() {
    return this._hotelConfig;
  }

  set hotelConfig(hotelConfig) {
    this._hotelConfig = hotelConfig;
  }

  get hotelId() {
    return this._hotelId || (this.hotelConfig && this._hotelConfig.id);
  }

  set hotelId(hotelId) {
    this._hotelId = hotelId;
  }

  get healthFormId() {
    return this._hotelConfig.healthFormId;
  }
}
