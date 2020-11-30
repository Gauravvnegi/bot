import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { BreakfastConfigI, BreakfastDetailDS } from '../data-models/breakfastConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class BreakfastService extends ApiService {

  private _breakfastDetailDS: BreakfastDetailDS;

  initBreakfastDetailDS(breakfastDetails) {
    this._breakfastDetailDS = new BreakfastDetailDS().deserialize(breakfastDetails);
  }

  setFieldConfigForBreakfastDetails() {
    let breakfastFormFieldSchema = {};

    breakfastFormFieldSchema['quantity'] = new FieldSchema().deserialize({
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
        code: "INVALID_FORM",
        msg: "Invalid form. Please fill all the fields.",
      });
    }
    return status;
  }

  get breakfastDetail(){
    return this._breakfastDetailDS
  }

}
