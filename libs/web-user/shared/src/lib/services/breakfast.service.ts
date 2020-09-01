import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { BreakfastConfigI } from '../data-models/breakfastConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class BreakfastService extends ApiService {

  setFieldConfigForBreakfastDetails() {
    let breakfastFormFieldSchema = {};

    breakfastFormFieldSchema['personCount'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'No.of Persons'
    });

    breakfastFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return breakfastFormFieldSchema as BreakfastConfigI;
  }

  validateBreakFastForm(breakfastForm: FormGroup) {
    let status = [];

    if (breakfastForm.invalid) {
      status.push({
        validity: false,
        msg: 'Invalid form. Please fill required fields.'
      });
    }
    return status;
  }

}
