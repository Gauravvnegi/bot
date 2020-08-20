import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { SpaConfigI } from '../data-models/spaConfig.model';

@Injectable()
export class SpaService extends ApiService{

  setFieldConfigForSpaDetails() {
    let breakfastFormFieldSchema = {};

    breakfastFormFieldSchema['personCount'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'No.of Persons'
    });

    breakfastFormFieldSchema['usageTime'] = new FieldSchema().deserialize({
      label: 'Enter Usage Time',
      disable: false
    });

    return breakfastFormFieldSchema as SpaConfigI;
  }
}
