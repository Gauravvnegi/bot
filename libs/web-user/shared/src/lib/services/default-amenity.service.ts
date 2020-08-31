import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { DefaultAmenityConfigI } from '../data-models/defaultAmenityConfig.model';

@Injectable()
export class DefaultAmenityService extends ApiService{

  setFieldConfigForDefaultAmenityDetails() {
    let defaultFormFieldSchema = {};

    defaultFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return defaultFormFieldSchema as DefaultAmenityConfigI;
  }
}
