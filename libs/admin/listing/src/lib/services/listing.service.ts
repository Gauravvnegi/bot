import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class ListingService extends ApiService {
  getAssetList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }

  getListings(config, hotelId: string) {
    return this.get(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }

  getListById(hotelId: string, listId: string): Observable<any> {
    return this.get(`/api/v1/marketing/entity/${hotelId}/listing/${listId}`);
  }

  createList(hotelId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${hotelId}/listing`, data);
  }

  importContact(hotelId: string, data): Observable<any> {
    return this.post(`/api/v1/marketing/entity/${hotelId}/contacts`, data);
  }

  updateList(hotelId: string, listId: string, data) {
    return this.put(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}`,
      data
    );
  }

  updateListStatus(hotelId: string, listId: string, data) {
    return this.patch(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}`,
      data
    );
  }

  deleteList(hotelId: string, config) {
    this.delete(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }

  deleteContact(hotelId: string, contactId: string): Observable<any> {
    return this.delete(
      `/api/v1/marketing/entity/${hotelId}/contacts${contactId}`
    );
  }

  updateListContact(hotelId: string, listId: string, data) {
    return this.post(
      `/api/v1/marketing/entity/${hotelId}/listing/${listId}/contacts`,
      data
    );
  }
}
