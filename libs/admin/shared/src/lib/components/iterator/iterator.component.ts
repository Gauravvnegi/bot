import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { IteratorField } from '../../types/fields.type';
import { FormProps } from '../../types/form.type';
import { ItemsData } from 'libs/admin/manage-reservation/src/lib/types/forms.types';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-iterator',
  templateUrl: './iterator.component.html',
  styleUrls: ['./iterator.component.scss'],
})
export class IteratorComponent implements OnChanges {
  constructor(protected fb: FormBuilder) {}

  @Output() currentIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() removedIndex: EventEmitter<number> = new EventEmitter<number>();

  @Input() fields: IteratorField[];
  @Input() useFormArray: FormArray;
  @Input() ctaLabel: '+ Add More';
  @Input() itemValues = [];

  @ViewChild('main') main: ElementRef;

  // Zero maxLimit means there is no limit
  @Input() maxLimit = 0;

  ngOnChanges(changes: SimpleChanges): void {
    const itemValues = changes.itemValues.currentValue;
    if (itemValues.length) {
      if (itemValues.length > 1) {
        // Create new form fields for each item in the array
        itemValues.forEach((item) => {
          this.createNewFields();
        });
      }
      // Patch the new values to the form array
      this.useFormArray.patchValue(itemValues);
    }
  }

  ngOnInit() {
    this.createNewFields();
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

    const formGroup = this.fb.group(data);
    this.useFormArray.push(formGroup);
    const index = this.useFormArray.controls.indexOf(formGroup);
    this.currentIndex.emit(index);
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
    this.removedIndex.emit(index);
  }
}
