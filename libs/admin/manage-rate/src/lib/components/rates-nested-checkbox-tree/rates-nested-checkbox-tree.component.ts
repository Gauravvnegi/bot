import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RoomTypes,
  UpdatedEmitType,
  Variant,
} from 'libs/admin/channel-manager/src/lib/types/bulk-update.types';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'hospitality-bot-rates-nested-checkbox-tree',
  templateUrl: './rates-nested-checkbox-tree.component.html',
  styleUrls: ['./rates-nested-checkbox-tree.component.scss'],
})
export class RatesNestedCheckboxTreeComponent extends FormControl {
  _roomsData: FormArray;

  @Input() set roomsData(value: FormArray) {
    this._roomsData = value;
    this.roomsData && this.patchTreeChanges();
  }

  get roomsData() {
    return this._roomsData;
  }

  @Input() controlNames = {
    roomTypes: 'roomTypes',
  };
  @Output() objectChanged: EventEmitter<{
    change: UpdatedEmitType;
    object: RoomTypes;
  }> = new EventEmitter();
  constructor(
    public controlContainer: ControlContainer,
    public fb: FormBuilder
  ) {
    super(controlContainer);
  }

  onRoomChange(event: UpdatedEmitType, objectIndex: number) {
    this.objectChanged.emit({
      change: event,
      object: this.roomsData[objectIndex],
    });
    this.patchTreeChanges();
  }

  patchTreeChanges() {
    const selectedItems = this.roomsData.controls?.filter((item) =>
      (item.get('variants') as FormArray).controls.some(
        (ratePlan) =>
          ratePlan.get('isSelected').value ||
          (ratePlan.get('pax') as FormArray).controls.some(
            (pax) => pax.get('isSelected').value
          )
      )
    ) as AbstractControl[];

    this.manageControl();

    selectedItems?.forEach((item) => {
      const types = this.parentFG.controls[
        this.controlNames.roomTypes
      ] as FormArray;

      (item.get('variants') as FormArray).controls
        .filter(
          (rp) =>
            rp.get('isSelected').value ||
            (rp.get('pax') as FormArray).controls.some(
              (pax) => pax.get('isSelected').value
            )
        )
        .forEach((variant, index) => {
          // if (variant.isSelected) {
          types.controls.push(
            this.fb.group({
              roomTypeId: item.get('id').value,
              ratePlanId: variant.get('id').value,
            })
          );

          types.patchValue([
            ...types.value,
            {
              roomTypeId: item.get('id').value,
              ratePlanId: variant.get('id').value,
            },
          ]);
          // }
        });
    });
  }

  get parentFG() {
    return this.controlContainer.control as FormGroup;
  }

  manageControl() {
    this.parentFG.removeControl(this.controlNames.roomTypes);
    this.parentFG.addControl(
      this.controlNames.roomTypes,
      this.fb.array([], [Validators.required])
    );
  }
}
