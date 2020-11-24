import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { CakeConfigI } from '../data-models/cakeConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class CakeService {

  setFieldConfigForCakeDetails() {
    let breakfastFormFieldSchema = {};

    breakfastFormFieldSchema['date'] = new FieldSchema().deserialize({
      label: 'Date',
      disable: false,
      placeholder: 'Enter Date'
    });

    breakfastFormFieldSchema['flavour'] = new FieldSchema().deserialize({
      label: 'Flavour',
      disable: false,
      placeholder: 'Enter Flavour'
    });

    breakfastFormFieldSchema['quantity'] = new FieldSchema().deserialize({
      label: 'Quantity',
      disable: false,
      placeholder: 'Enter Quantity (In Pounds)'
    });

    breakfastFormFieldSchema['expectedTime'] = new FieldSchema().deserialize({
      label: 'Expected Time',
      disable: false,
      placeholder: 'Enter Expected Time'
    });

    breakfastFormFieldSchema['message'] = new FieldSchema().deserialize({
      label: 'Message',
      disable: false,
      placeholder: 'Enter Message'
    });

    breakfastFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return breakfastFormFieldSchema as CakeConfigI;
  }

  validateCakeForm(cakeForm: FormGroup) {
    let status = [];

    if (cakeForm.invalid) {
      status.push({
        validity: false,
        code: "INVALID_FORM",
        msg: "Invalid form. Please fill all the fields.",
      });
    }
    return status;
  }
}
