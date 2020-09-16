import { Injectable } from '@angular/core';
import { SummaryDetailsConfigI } from '../data-models/billSummaryConfig.model';
import { FieldSchema } from '../data-models/fieldSchema.model';

@Injectable()
export class SummaryService {
  setFieldConfigForGuestDetails() {
    let summaryDetailsFieldSchema = {};

    summaryDetailsFieldSchema['request'] = new FieldSchema().deserialize({
      master_label: 'Any special Request ?',
      disable: false,
      appearance: 'outline',
      type: 'textarea',
      placeholder:
        'Request us for anything like Airport Dropoff, Pickup at Airport, Go for sightseeing, etc.',
    });

    return summaryDetailsFieldSchema as SummaryDetailsConfigI;
  }
}
