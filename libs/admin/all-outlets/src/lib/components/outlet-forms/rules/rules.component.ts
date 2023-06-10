import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
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
          title: [''],
          description: [''],
        }),
      ]),
    });

    this.rulesControl = this.useForm.get('rules') as FormArray;

    if (this.inputControl.value.length) {
      this.rulesControl.patchValue(this.inputControl.value);
    }
  }

  addRule(): void {
    this.rulesControl.push(
      this.fb.group({
        title: [''],
        description: [''],
      })
    );
  }

  onValueChange(): void {
    this.rulesControl.valueChanges.subscribe((res) => {
      this.inputControl.setValue(res);
    });
  }
}
