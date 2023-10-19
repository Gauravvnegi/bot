import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs/internal/Observable';
import { Measures } from '../data-models/safeMeasureConfig.model';

@Injectable()
export class SafeMeasuresService extends ApiService {
  getSafeMeasures(entityId): Observable<Measures> {
    return this.get(`/api/v1/entity/${entityId}/covid/safe-measures`);
  }
}
