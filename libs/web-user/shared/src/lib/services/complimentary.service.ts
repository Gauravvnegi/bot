import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { ComplimentaryServiceDetailDS } from '../data-models/complimentaryServiceConfig.model';

@Injectable()
export class ComplimentaryService extends ApiService {
  private _complimentaryServiceDetailDS: ComplimentaryServiceDetailDS;

  initComplimentaryAmenitiesDetailDS(amenities) {
    this._complimentaryServiceDetailDS = new ComplimentaryServiceDetailDS().deserialize(
      amenities
    );
  }

  get complimentaryAmenities() {
    return this._complimentaryServiceDetailDS;
  }
}
