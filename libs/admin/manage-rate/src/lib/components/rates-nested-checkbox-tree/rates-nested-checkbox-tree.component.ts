import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RoomTypes,
  UpdatedEmitType,
  Variant,
} from '../../types/bulk-update.types';
import {
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
  private _roomsData: RoomTypes[];
  @Input() set roomsData(value: RoomTypes[]) {
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
    const selectedItems = this.roomsData?.filter((item) =>
      item.variants.some((ratePlan) => ratePlan.isSelected)
    );
    this.manageControl();
    selectedItems?.forEach((item) => {
      const types = this.parentFG.controls[
        this.controlNames.roomTypes
      ] as FormArray;

      item.variants.forEach((variant, index) => {
        if (variant.isSelected) {
          types.controls.push(
            this.fb.group({
              roomTypeId: item.id,
              ratePlanId: variant.id,
            })
          );

          types.patchValue([
            ...types.value,
            {
              roomTypeId: item.id,
              ratePlanId: variant.id,
            },
          ]);
        }
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
