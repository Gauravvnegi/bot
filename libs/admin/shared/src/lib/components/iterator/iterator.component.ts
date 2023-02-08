import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IteratorField } from '../../types/fields.type';

@Component({
  selector: 'hospitality-bot-iterator',
  templateUrl: './iterator.component.html',
  styleUrls: ['./iterator.component.scss'],
})
export class IteratorComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  @Input() fields: IteratorField[];

  fieldConfig: Record<string, string | number>;

  @Input() useFormArray: FormArray;

  ngOnInit(): void {
    this.initNewField();
  }

  /**
   * @function initNewField To get the initial value config
   */
  initNewField() {
    this.fieldConfig = this.fields.reduce((prev, curr) => {
      prev[curr.name] = '';
      return prev;
    }, {});
  }

  get width() {
    const currentWidth = 100 / this.fields.length;
    return `${currentWidth > 20 ? 20 : currentWidth}%`;
  }

  /**
   * Handle addition of new field to array
   */
  addNewField() {
    this.useFormArray.push(this.fb.group(this.fieldConfig));
  }

  /**
   * @function removeField handle the removal of fields from array
   * @param index position at which value is to be removed
   */
  removeField(index: number) {
    if (this.useFormArray.length === 1) {
      this.useFormArray.at(0).patchValue(this.fieldConfig);
      return;
    }
    this.useFormArray.removeAt(index);
  }
}
