import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableValue } from '../constants/tabFilterItem';

/**
 * @class Manages all the api call for reservation.
 */
@Injectable({ providedIn: 'root' })
export class ReservationService extends ApiService {
  selectedTable = TableValue.arrival;
  bookingNumber: string;
  guestId: string;

  getReservationDetailsById(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }
  /**
   * @function getReservationDetails To get reservation list for the current filters.
   * @param config The config for query parameters.
   * @returns An Observable with reservation list.
   */
  getReservationDetails(config): Observable<any> {
    return this.get(`/api/v1/reservations${config.queryObj}`);
  }

  /**
   * @function exportCSV To export the reservation list in CSV format.
   * @param config The config for query parameters.
   * @returns An Observable with blob.
   */
  exportCSV(config): Observable<any> {
    return this.get(`/api/v1/reservations/export/${config.queryObj}`, {
      responseType: 'blob',
    });
  }
}
