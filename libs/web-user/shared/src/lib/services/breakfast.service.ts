import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { BreakfastConfigI } from '../data-models/breakfastConfig.model';

@Injectable()
export class BreakfastService extends ApiService {

  setFieldConfigForBreakfastDetails() {
    let breakfastFormFieldSchema = {};

    breakfastFormFieldSchema['personCount'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'No.of Persons'
    });

    breakfastFormFieldSchema['foodPackage'] = new FieldSchema().deserialize({
      label: 'Select Package',
      disable: false,
      placeholder: 'Select Package',
      options: [
        { key: 'Breakfast', value: 'Breakfast' },
        { key: 'Lunch', value: 'Lunch' },
        { key: 'Dinner', value: 'Dinner' },
      ],
    });

    return breakfastFormFieldSchema as BreakfastConfigI;
  }

}
