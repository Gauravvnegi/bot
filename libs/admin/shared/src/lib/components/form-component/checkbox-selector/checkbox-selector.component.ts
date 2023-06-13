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

  checkBoxForm: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.setControls();
    this.listenChanges();
  }

  setControls() {
    this.checkboxControlsName = this.menuOptions.map((item) => item.value);
    this.checkBoxForm = this.fb.group({
      all: false,
    });
    for (const item of this.checkboxControlsName) {
      this.checkBoxForm.addControl(item, this.fb.control(false));
    }
  }

  listenChanges() {
    this.checkBoxForm.valueChanges.subscribe((changedCheckbox) => {
      let selectedCheckbox = [];
      Object.keys(changedCheckbox).forEach((key) => {
        const value = changedCheckbox[key];
        value && selectedCheckbox.push(key);
      });

      changedCheckbox.all &&
        (selectedCheckbox = [...this.checkboxControlsName]);

      this.controlContainer.control.get(this.controlName).patchValue({
        [this.controlName]: selectedCheckbox,
      });

      console.log(this.controlContainer.control.get(this.controlName).value);
    });
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
}
