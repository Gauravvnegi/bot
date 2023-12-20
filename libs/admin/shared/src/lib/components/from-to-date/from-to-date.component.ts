import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { FormComponent } from '../form-component/form.components';
@Component({
  selector: 'hospitality-bot-from-to-date',
  templateUrl: './from-to-date.component.html',
  styleUrls: ['./from-to-date.component.scss'],
})
export class FromToDateComponent extends FormComponent implements OnInit {
  endMinDate: Date = new Date();
  @Input() startMaxDate: Date;
  @Input() startMinDate: Date = new Date();
  @Input() endMaxDate: Date;
  @Input() controlNames = {
    from: 'fromDate',
    to: 'toDate',
  };
  @Input() labels = {
    from: 'From',
    to: 'To',
  };

  @Input() className: string;
  @Input() isTimeEnable = false;
  @Input() isTimeOnly = false;
  @Input() showIcon = true;
  @Input() showDash = false;

  preErrorMessages: Record<string, string> = {
    required: 'This is required field',
  };
  postErrorMessages: Record<string, string> = {
    required: 'This is required field',
  };

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit() {
    this.parentFG.get(this.controlNames.from)?.valueChanges.subscribe((res) => {
      if (!this.isTimeOnly) {
        if (this.parentFG.value.toDate < res) {
          const nextDate = new Date(res);
          nextDate.setDate(nextDate.getDate() + 1);
          this.parentFG.patchValue({ [this.controlNames.to]: nextDate });
        }
        this.endMinDate = new Date(res);
      }
    });
  }

  get parentFG() {
    return this.controlContainer.control as FormGroup;
  }
}
