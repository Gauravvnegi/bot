import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';

/**
 * @class Manages all the api calls for dashboard stats.
 */
@Injectable()
export class StatisticsService extends ApiService {
  /**
   * @function getStatistics To get the dashboard stats data.
   * @param config The config for query parameters.
   * @returns An Observable with stats data.
   */
  getStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/${config.queryObj}`);
  }

  /**
   * @function getCustomerStatistics To get the customer stats data.
   * @param config The config for query parameters.
   * @returns An Observable with stats data.
   */
  getCustomerStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/customer/${config.queryObj}`);
  }

  /**
   * @function getBookingStatusStatistics To get the Booking Status stats data.
   * @param config The config for query parameters.
   * @returns An Observable with stats data.
   */
  getBookingStatusStatistics(config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/reservations/status/${config.queryObj}`
    );
  }

  /**
   * @function getReservationStatistics To get the Reservation stats data.
   * @param config The config for query parameters.
   * @returns An Observable with stats data.
   */
  getReservationStatistics(config): Observable<any> {
    return this.get(`/api/v1/dashboard-stats/reservations/${config.queryObj}`);
  }

  /**
   * @function getConversationStats To get the Conversation stats data.
   * @param config The config for query parameters.
   * @returns An Observable with stats data.
   */
  getConversationStats(hotelId: string, config): Observable<any> {
    return this.get(
      `/api/v1/dashboard-stats/conversations-stats/counts${config.queryObj}`
    );
  }

  /**
   * @function getHotelChannels To get the active channel list data.
   * @param config The config for query parameters.
   * @returns An Observable with active channel list for the hotel.
   */
  getHotelChannels(hotelId): Observable<any> {
    return this.get(`/api/v1/entity/${hotelId}/channels`);
  }
}
