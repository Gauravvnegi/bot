import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { Observable } from 'rxjs';

@Injectable()
export class HotelService extends ApiService {
  private _hotelConfig;
  private _currentJourney: string;
  private _hotelId: string;

  getCurrentJourneyConfig() {
    return this.hotelConfig && this.hotelConfig.journeys[this.currentJourney];
  }

  getHotelConfigById(hotelId): Observable<any> {
    return this.get(`/api/v1/hotel/${hotelId}`);
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

  get hotelId(): string {
    return this._hotelId || (this.hotelConfig && this._hotelConfig.id);
  }

  set hotelId(hotelId: string) {
    this._hotelId = hotelId;
  }

  get healthFormId(): string {
    return this._hotelConfig.healthFormId;
  }
}
