import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';

@Component({
  selector: 'hospitality-bot-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent extends FormComponent implements OnInit {
  useForm: FormGroup;
  rulesControl: FormArray;

  constructor(
    public controlContainer: ControlContainer,
    private fb: FormBuilder
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.initForm();
    this.onValueChange();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      rules: this.fb.array([
        this.fb.group({
          title: ['', [Validators.required]],
          description: ['', [Validators.required]],
        }),
      ]),
    });

    this.rulesControl = this.useForm.get('rules') as FormArray;

    this.patchValueToRules();
  }

  /**
   * @function patchValueToRules
   * @description patch value to rules form array
   * @returns void
   * @memberof RulesComponent
   * @param none
   */
  patchValueToRules(): void {
    if (this.inputControl.value.length) {
      this.rulesControl.patchValue(this.inputControl.value);
    }

    this.rulesControl.valueChanges.subscribe((res) => {
      this.inputControl.setValue(res);
    });
  }

  /**
   * @function addRule
   * @description add rule to rules form array
   * @returns void
   */
  addRule(): void {
    this.rulesControl.push(
      this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
      })
    );
  }

  /**
   * @function onValueChange
   * @description listen to value changes and patch value to input control
   * @returns void
   * @memberof RulesComponent
   * @param none
   */
  onValueChange(): void {
    this.rulesControl.valueChanges.subscribe((res) => {
      this.inputControl.setValue(res);
    });
  }

  removeRule(index: number): void {
    this.rulesControl.removeAt(index);
  }
}
