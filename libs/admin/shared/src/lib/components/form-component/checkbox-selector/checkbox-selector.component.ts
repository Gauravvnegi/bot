import { Component, Input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-checkbox-selector',
  templateUrl: './checkbox-selector.component.html',
  styleUrls: ['./checkbox-selector.component.scss'],
})
export class CheckboxSelectorComponent extends FormComponent {
  checkboxControlsName: string[];
  defaultAllChecked = false;
  @Input() set allChecked(value: boolean) {
    this.defaultAllChecked = value;
    this.setControls(value);
    this.setDefault();
  }

  checkBoxForm: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.setControls(this.defaultAllChecked);
    this.setDefault();
    this.listenChanges();
  }

  setControls(isSelected) {
    this.checkboxControlsName = this.menuOptions.map((item) => item.value);
    this.checkBoxForm = this.fb.group({
      all: isSelected,
    });
    for (const item of this.checkboxControlsName) {
      this.checkBoxForm.addControl(item, this.fb.control(isSelected));
    }
    isSelected &&
      this.controlContainer.control &&
      this.patchMyValues(this.checkBoxForm.getRawValue());
  }

  listenChanges() {
    this.checkBoxForm.valueChanges.subscribe((changedCheckbox) => {
      this.controlContainer.control.get(this.controlName).markAsDirty();
      this.patchMyValues(changedCheckbox);
    });
  }

  patchMyValues(changedCheckbox) {
    let selectedCheckbox = [];
    Object.keys(changedCheckbox).forEach((key) => {
      const value = changedCheckbox[key];
      value && selectedCheckbox.push(key);
    });
    changedCheckbox.all && (selectedCheckbox = [...this.checkboxControlsName]);

    const control = this.controlContainer.control.get(this.controlName);
    control?.patchValue(selectedCheckbox);
  }

  toggleSelectAll(): void {
    const allValue = this.checkBoxForm.get('all').value;

    for (const item of this.checkboxControlsName) {
      this.checkBoxForm.get(item).setValue(allValue);
    }
  }

  toggleCheckboxSelection(): void {
    const allControl = this.checkBoxForm.get('all');

    if (
      this.checkboxControlsName.some(
        (item) => !this.checkBoxForm.get(item).value
      )
    ) {
      allControl.setValue(false);
    } else {
      allControl.setValue(true);
    }
  }

  setDefault() {
    const control = this.controlContainer.control.get(this.controlName);
    const totalLength = control?.value?.length;
    if (totalLength) {
      if (this.menuOptions.length == totalLength) {
        this.setControls(true);
        return;
      }
      control.value.forEach((item) => {
        this.checkBoxForm.patchValue({ [item]: true });
      });
    } else {
      this.setControls(this.defaultAllChecked);
    }
  }
}
