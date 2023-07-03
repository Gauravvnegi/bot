import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';
import { TableValue } from '../constants/listing';

@Injectable()
export class ListingService extends ApiService {
  selectedTab = TableValue.all;
  /**
   * @function getTopicList get topic list.
   * @param id dynamically getting id into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of topic list.
   */
  getTopicList(id: string, config): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics/${config.queryObj}`);
  }

  /**
   * @function getListings get listing records.
   * @param config dynamically getting global query filter into api.
   * @param hotelId dynamically getting hotelId into api.
   * @returns get api of listing.
   */
  getListings(config, hotelId: string) {
    return this.get(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }

  /**
   * @function getListById get listing record by listingId.
   * @param hotelId dynamically getting hotelId into api.
   * @param listId dynamically getting listId into api.
   * @returns get api of listing be id.
   */
  getListById(hotelId: string, listId: string): Observable<any> {
    return this.get(`/api/v1/marketing/entity/${hotelId}/listing/${listId}`);
  }

  /**
   * @function createList create new listing record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @returns post api of adding new listing record.
   */
  createList(hotelId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${hotelId}/listing`, data);
  }

  /**
   * @function importContact imports contact record.
   * @param hotelId dynamically getting hotelId into api.
   * @param data getting form input data.
   * @returns psot api of importing contacts.
   */
  importContact(hotelId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${hotelId}/contacts`, data);
  }

  /**
   * @function updateList updates listing record.
   * @param hotelId dynamically getting hotelId into api.
   * @param listId dynamically getting listId into api.
   * @param data getting form input data.
   * @returns put api of update listing.
   */
  updateList(hotelId: string, listId: string, data) {
    return this.put(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}`,
      data
    );
  }

  /**
   * @function updateListStatus updates status of a listing record.
   * @param hotelId dynamically getting hotelId into api.
   * @param listId dynamically getting listId into api.
   * @param data getting form input data.
   * @returns patch api of update status of a listing.
   */
  updateListStatus(hotelId: string, listId: string, data) {
    return this.patch(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}`,
      data
    );
  }

  /**
   * @function deleteList deletes listing record.
   * @param hotelId dynamically getting hotelId into api.
   * @param config dynamically getting global query filter into api.
   */
  deleteList(hotelId: string, config) {
    this.delete(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }

  /**
   * @function deleteContact deletes contact record.
   * @param hotelId dynamically getting hotelId into api.
   * @param contactId dynamically getting contactId into api.
   * @returns delete api of contact.
   */
  deleteContact(hotelId: string, contactId: string): Observable<any> {
    return this.delete(
      `/api/v1/marketing/entity/${hotelId}/contacts${contactId}`
    );
  }

  /**
   * @function updateListContact update contact list.
   */
  updateListContact(hotelId: string, listId: string, data) {
    return this.post(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}/contacts`,
      data
    );
  }

  /**
   * @function exportContact exports contact.
   * @param hotelId dynamically getting hotelId into api.
   * @param listId dynamically getting listId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export contact list.
   */
  exportContact(hotelId: string, listId: string, config) {
    return this.get(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function exportListings exports listing.
   * @param hotelId dynamically getting hotelId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export list.
   */
  exportListings(hotelId: string, config) {
    return this.get(
      `/api/v1/marketing/entity/${hotelId}/listing/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }
}
