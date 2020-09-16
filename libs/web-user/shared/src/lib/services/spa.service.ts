import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { FieldSchema } from '../data-models/fieldSchema.model';
import { SpaConfigI } from '../data-models/spaConfig.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class SpaService extends ApiService{

  setFieldConfigForSpaDetails() {
    let spaFormFieldSchema = {};

    spaFormFieldSchema['personCount'] = new FieldSchema().deserialize({
      label: ' ',
      disable: false,
      placeholder: 'No.of Persons'
    });

    spaFormFieldSchema['usageTime'] = new FieldSchema().deserialize({
      label: 'Enter Usage Time',
      disable: false
    });

    spaFormFieldSchema['removeButton'] = new FieldSchema().deserialize({
      label: 'Remove',
      disable: false,
    });

    return spaFormFieldSchema as SpaConfigI;
  }

  validateSpaForm(spaForm: FormGroup) {
    let status = [];

    if (spaForm.invalid) {
      status.push({
        validity: false,
        msg: 'Invalid form. Please fill required fields.'
      });
    }
    return status;
  }
}
