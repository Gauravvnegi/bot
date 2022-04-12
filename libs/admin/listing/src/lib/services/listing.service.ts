import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class ListingService extends ApiService {
  getAssetList(id: string): Observable<any> {
    return this.get(`/api/v1/entity/${id}/topics`);
  }
}
