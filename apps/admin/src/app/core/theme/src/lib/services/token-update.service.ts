import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../../../../libs/shared/utils/src/lib/services/api.service';

@Injectable({ providedIn: 'root' })
export class TokenUpdateService extends ApiService {
  getUpdatedToken(entityId: string) {
    return this.get(`/api/v1/entity/${entityId}/access-token`);
  }
}
