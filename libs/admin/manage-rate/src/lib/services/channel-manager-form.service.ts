import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ChannelManagerFormService as CommonChannelManagerFormService } from 'libs/admin/channel-manager/src/lib/services/channel-manager-form.service';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/types/bulk-update.types';

@Injectable()
export class ChannelManagerFormService extends CommonChannelManagerFormService {
  validateUpdateForm(
    form: FormGroup,
    treeData: RoomTypes[]
  ): { formStatus: boolean; treeStatus: boolean } {
    const data = form.getRawValue();

    const controlNames = [
      'fromDate',
      'roomType',
      'selectedDays',
      'toDate',
      'update',
      'updateValue',
    ];

    const controls = controlNames.reduce((acc, controlName) => {
      acc[controlName] = form.controls[controlName];
      return acc;
    }, {});

    const formStatus = controlNames.every(
      (controlName) => controls[controlName].valid
    );
    const treeStatus = treeData.some((tree) => {
      return tree?.variants?.some(
        (v) => v.isSelected || v.pax.some((pax) => pax.isSelected)
      );
    });

    return { formStatus, treeStatus };
  }
}
