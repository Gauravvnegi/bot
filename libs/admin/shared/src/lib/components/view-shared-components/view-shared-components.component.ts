import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormProps } from 'libs/admin/shared/src/lib/types/form.type';
import { Regex } from '../../constants';

@Component({
  selector: 'hospitality-bot-view-shared-components',
  templateUrl: './view-shared-components.component.html',
  styleUrls: ['./view-shared-components.component.scss'],
})
export class ViewSharedComponentsComponent implements OnInit {
  useForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  props: FormProps = {
    variant: 'standard',
    alignment: 'vertical',
  };

  options = [
    { label: 'Hello', value: 'HELLO', id: '123123' },
    { label: 'Bye', value: 'BYE', id: '56756756' },
    { label: 'Today', value: 'TODAY', id: '21312' },
    { label: 'Tomorrow', value: 'TOMORROW', id: '623521' },
    { label: 'Hi', value: 'HI', id: '2346431' },
  ];

  currentStatus = 'ACTIVE';
  listItem = [
    {
      label: 'Active',
      value: 'ACTIVE',
      type: 'new',
    },
    {
      label: 'Unavailable',
      value: 'UNAVAILABLE',
      type: 'warning',
    },
    {
      label: 'Inactive',
      value: 'INACTIVE',
      type: 'failed',
    },
  ];

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useForm = this.fb.group({
      selectField: this.fb.group({
        radio: ['', Validators.required],
        checkbox: ['', Validators.required],
        toggleSwitch: [false],
      }),

      outlinedField: this.fb.group({
        date: ['', Validators.required],
        select: ['', Validators.required],
        input: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern(Regex.EMAIL_REGEX),
          ],
        ],
        multiSelect: ['', Validators.required],
        postInput: ['', Validators.required],
        preInput: ['', Validators.required],
      }),

      standardField: this.fb.group({
        date: ['', Validators.required],
        select: ['', Validators.required],
        input: ['', Validators.required],
        multiSelect: ['', Validators.required],
        postInput: ['', Validators.required],
        preInput: ['', Validators.required],
      }),
    });

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  handleStatus(status: string) {
    this.currentStatus = status;
  }
}
