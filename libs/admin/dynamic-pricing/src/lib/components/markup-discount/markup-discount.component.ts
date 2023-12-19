import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';

@Component({
  selector: 'hospitality-bot-markup-discount',
  templateUrl: './markup-discount.component.html',
  styleUrls: ['./markup-discount.component.scss'],
})
export class MarkupDiscountComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public controlContainer: ControlContainer
  ) {}

  useForm: FormGroup;

  @Input() controlName = 'discount';
  inputControl: AbstractControl;

  ngOnInit(): void {
    this.initForm();
    this.initSubscription();
  }

  initForm() {
    this.inputControl = this.controlContainer.control.get(this.controlName);

    const data: Record<UseFromKey, any> = {
      discount: [, [Validators.min(0), Validators.required]],
      isMarkup: [true],
    };

    this.useForm = this.fb.group(data);
  }

  initSubscription() {
    /**
     * Use From Subscription
     */
    this.useForm.valueChanges.subscribe(
      ({ discount, isMarkup }: UseFromValue) => {
        console.log(discount, isMarkup, 'useForm');
        const value = isMarkup ? discount : -discount;

        if (this.useForm.errors) {
          this.inputControl.setErrors({ isInvalid: true });
        } else {
          this.inputControl.setErrors(null);
          this.inputControl.patchValue(value);
        }
      }
    );

    /**
     * Validators update
     */
    this.useFromControl.isMarkup.valueChanges.subscribe((res) => {
      // this.useFromControl.discount.clearValidators();

      if (res) {
        this.useFromControl.discount.setValidators([
          Validators.min(0),
          Validators.required,
        ]);
      } else {
        this.useFromControl.discount.setValidators([
          Validators.max(100),
          Validators.min(0),
          Validators.required,
        ]);
      }
      this.useFromControl.discount.updateValueAndValidity();
    });

    /**
     * Input Control Subscription
     */
    this.inputControl.valueChanges.subscribe((res: number) => {
      console.log(res, 'inputControl');

      this.useForm.patchValue(
        {
          discount: Math.abs(res),
          isMarkup: res > 0,
        } as UseFromValue,
        { emitEvent: false }
      );
    });
  }

  get useFromControl() {
    return this.useForm.controls as Record<UseFromKey, AbstractControl>;
  }
}

type UseFromValue = {
  discount: number;
  isMarkup: boolean;
};

type UseFromKey = keyof UseFromValue;
