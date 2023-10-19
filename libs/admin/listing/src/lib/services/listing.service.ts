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
   * @param entityId dynamically getting entityId into api.
   * @returns get api of listing.
   */
  getListings(config, entityId: string) {
    return this.get(
      `/api/v1/marketing/entity/${entityId}/listing${config.queryObj}`
    );
  }

  /**
   * @function getListById get listing record by listingId.
   * @param entityId dynamically getting entityId into api.
   * @param listId dynamically getting listId into api.
   * @returns get api of listing be id.
   */
  getListById(entityId: string, listId: string): Observable<any> {
    return this.get(`/api/v1/marketing/entity/${entityId}/listing/${listId}`);
  }

  /**
   * @function createList create new listing record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @returns post api of adding new listing record.
   */
  createList(entityId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${entityId}/listing`, data);
  }

  /**
   * @function importContact imports contact record.
   * @param entityId dynamically getting entityId into api.
   * @param data getting form input data.
   * @returns psot api of importing contacts.
   */
  importContact(entityId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${entityId}/contacts`, data);
  }

  /**
   * @function updateList updates listing record.
   * @param entityId dynamically getting entityId into api.
   * @param listId dynamically getting listId into api.
   * @param data getting form input data.
   * @returns put api of update listing.
   */
  updateList(entityId: string, listId: string, data) {
    return this.put(
      `/api/v1/marketing/entity/${entityId}/listing/${listId}`,
      data
    );
  }

  /**
   * @function updateListStatus updates status of a listing record.
   * @param entityId dynamically getting entityId into api.
   * @param listId dynamically getting listId into api.
   * @param data getting form input data.
   * @returns patch api of update status of a listing.
   */
  updateListStatus(entityId: string, listId: string, data) {
    return this.patch(
      `/api/v1/marketing/entity/${entityId}/listing/${listId}`,
      data
    );
  }

  /**
   * @function deleteList deletes listing record.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   */
  deleteList(entityId: string, config) {
    this.delete(
      `/api/v1/marketing/entity/${entityId}/listing${config.queryObj}`
    );
  }

  /**
   * @function deleteContact deletes contact record.
   * @param entityId dynamically getting entityId into api.
   * @param contactId dynamically getting contactId into api.
   * @returns delete api of contact.
   */
  deleteContact(entityId: string, contactId: string): Observable<any> {
    return this.delete(
      `/api/v1/marketing/entity/${entityId}/contacts${contactId}`
    );
  }

  /**
   * @function updateListContact update contact list.
   */
  updateListContact(entityId: string, listId: string, data) {
    return this.post(
      `/api/v1/marketing/entity/${entityId}/listing/${listId}/contacts`,
      data
    );
  }

  /**
   * @function exportContact exports contact.
   * @param entityId dynamically getting entityId into api.
   * @param listId dynamically getting listId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export contact list.
   */
  exportContact(entityId: string, listId: string, config) {
    return this.get(
      `/api/v1/marketing/entity/${entityId}/listing/${listId}/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   * @function exportListings exports listing.
   * @param entityId dynamically getting entityId into api.
   * @param config dynamically getting global query filter into api.
   * @returns get api of export list.
   */
  exportListings(entityId: string, config) {
    return this.get(
      `/api/v1/marketing/entity/${entityId}/listing/export${config.queryObj}`,
      {
        responseType: 'blob',
      }
    );
  }
}
