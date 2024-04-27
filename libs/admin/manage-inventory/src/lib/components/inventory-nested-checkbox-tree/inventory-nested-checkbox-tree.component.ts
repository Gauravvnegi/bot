import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Variant } from 'libs/admin/channel-manager/src/lib/types/bulk-update.types';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-inventory-nested-checkbox-tree',
  templateUrl: './inventory-nested-checkbox-tree.component.html',
  styleUrls: ['./inventory-nested-checkbox-tree.component.scss'],
})
export class InventoryNestedCheckboxTreeComponent extends FormComponent {
  _variants: FormArray;

  @Input() set variants(value: FormArray) {
    this._variants = value;
    this._variants &&
      this.patchChildrenData(this.childrenControlName.roomTypeIds);
  }

  get variants(): FormArray {
    return this._variants;
  }
  @Input() childrenControlName = {
    roomTypeIds: 'roomTypeIds',
    channelIds: 'channelIds',
  };

  @Output() objectChange = new EventEmitter();

  ngOnInit(): void {
    this.checkBoxVerify();
  }

  onChannelChange(status: boolean, variantIndex: number, channelIndex: number) {
    // const selectedObject = this._variants.at(variantIndex) as FormGroup

    // (selectedObject.get('channels') as FormArray).controls.at(channelIndex).get('isSelected').value = status;

    // selectedObject.isSelected = selectedObject.channels.every(
    //   (item) => item.isSelected
    // );
    this.objectChange.emit();
    this.patchChildrenData(this.childrenControlName.channelIds);
  }

  onVariantChange(status: boolean, variantIndex: number) {
    const selectedObject = this._variants.at(variantIndex);
    selectedObject.get('isSelected').patchValue(status);
    // selectedObject.channels.map((item) => (item.isSelected = status));
    this.objectChange.emit();
    this.patchChildrenData(this.childrenControlName.roomTypeIds);
  }

  get parentFG() {
    return this.controlContainer.control as FormGroup;
  }

  patchChildrenData(controlName) {
    (this.parentFG.controls[this.controlName].value as FormGroup).patchValue(
      {
        [controlName]: this.variants.controls
          .map(
            (variant) =>
              variant.get('isSelected').value && variant.get('id').value
          )
          .filter((item) => item),
      },
      { emitEvent: false }
    );
  }

  checkBoxVerify() {
    for (let item in this.variants) {
      item['channels'] &&
        (item['isSelected'] = item['channels'].every(
          (item) => item['isSelected']
        ));
    }
  }
}
