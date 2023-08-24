import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { FormComponent } from '../form-component/form.components';

@Component({
  selector: 'hospitality-bot-from-to-date',
  templateUrl: './from-to-date.component.html',
  styleUrls: ['./from-to-date.component.scss'],
})
export class FromToDateComponent extends FormComponent implements OnInit {
  @Input() startMinDate = new Date();
  endMinDate = new Date();
  startMaxDate: Date;
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

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit() {
    this.parentFG.get(this.controlNames.from)?.valueChanges.subscribe((res) => {
      if (this.parentFG.value.toDate < res)
        this.parentFG.patchValue({ toDate: '' }, { emitEvent: false });
      this.endMinDate = new Date(res);
    });

    this.parentFG.get(this.controlNames.to)?.valueChanges.subscribe((res) => {
      this.startMaxDate = new Date(res);
      if (this.parentFG.value.fromDate > res)
        this.parentFG.patchValue({ fromDate: '' }, { emitEvent: false });
    });
  }

  get parentFG() {
    return this.controlContainer.control as FormGroup;
  }
}
