import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Revenue } from '../../constants/revenue-manager.const';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent implements OnInit {
  @Input() dynamicPricingFG: FormGroup;

  weeks = weeks;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  getTriggerFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      name: [''],
      fromDate: [''],
      toDate: [''],
      selectedDays: [[]],
      levels: this.fb.array([this.getLevelFG()]),
      status: [true],
    });
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  getLevelFG(): FormGroup {
    return this.fb.group({
      time: [''],
      occupancyLowerLimit: [''],
      occupancyUpperLimit: [''],
      discount: [''],
    });
  }

  modifyTriggerFG(mode = Revenue.add, index?: number): void {
    if (mode == Revenue.add)
      this.dynamicPricingControl.timeFA.controls.push(this.getTriggerFG());
    else this.dynamicPricingControl.timeFA.removeAt(index);
  }

  modifyLevelFG(
    triggerFG: FormGroup,
    mode = Revenue.add,
    index?: number
  ): void {
    const levelFA = triggerFG.get('levels') as FormArray;
    if (mode == Revenue.add) levelFA.controls.push(this.getLevelFG());
    else levelFA.removeAt(index);
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG.controls as Record<
      'timeFA',
      AbstractControl
    > & {
      timeFA: FormArray;
    };
  }
}
