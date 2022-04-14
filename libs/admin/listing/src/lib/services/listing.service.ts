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
    this.patch(`/api/v1/marketing/entity/${hotelId}/listing/${listId}`, data);
  }

  deleteList(hotelId: string, config) {
    this.delete(
      `/api/v1/marketing/entity/${hotelId}/listing${config.queryObj}`
    );
  }
}
