import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IteratorField } from '../../types/fields.type';
import { FormProps } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-iterator',
  templateUrl: './iterator.component.html',
  styleUrls: ['./iterator.component.scss'],
})
export class IteratorComponent implements OnChanges {
  constructor(private fb: FormBuilder) {}

  props: FormProps = {
    height: '35px',
    fontSize: '14px',
  };

  @Input() fields: IteratorField[];
  @Input() useFormArray: FormArray;
  @ViewChild('main') main: ElementRef;

  // Zero maxLimit means there is no limit
  @Input() maxLimit = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.useFormArray?.currentValue.length) {
      this.createNewFields();
    }
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields() {
    const data = this.fields.reduce((prev, curr) => {
      const value = curr.required ? ['', Validators.required] : [''];
      prev[curr.name] = value;
      return prev;
    }, {});
    this.useFormArray.push(this.fb.group(data));
  }

  get width() {
    const currentWidth = 100 / this.fields.length;
    return `${currentWidth > 20 ? 20 : currentWidth}%`;
  }

  /**
   * Handle addition of new field to array
   */
  addNewField() {
    if (this.useFormArray.invalid) {
      this.useFormArray.markAllAsTouched();
      return;
    }
    this.createNewFields();
    setTimeout(() => {
      this.main.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.main.nativeElement.scrollTop = this.main.nativeElement.scrollHeight;
    }, 1000);
  }

  /**
   * @function removeField handle the removal of fields from array
   * @param index position at which value is to be removed
   */
  removeField(index: number) {
    if (this.useFormArray.length === 1) {
      this.useFormArray.at(0).reset();
      return;
    }
    this.useFormArray.removeAt(index);
  }
}
